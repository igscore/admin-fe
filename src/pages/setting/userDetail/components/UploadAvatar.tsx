import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, message, Upload, Typography } from 'antd';
import ImgCrop from 'antd-img-crop';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import cacheMng from '@/managers/cacheMng';
import Flex from '@/components/Flex';

import styles from './UploadAvatar.less';

export interface UploadAvatarData {
  id: number;
  url: string;
}

interface Props {
  avatarUrl?: string;
  disabled?: boolean;
  onSave: (params: UploadAvatarData) => void;
}

const getAvatar = (url: string) => ({ id: 0, url });

const UploadAvatar: React.FC<Props> = (props) => {
  const { avatarUrl, disabled = false, onSave } = props;
  const [loading, handleLoading] = useState<boolean>(false);
  const [uploadData, handleUpload] = useState<UploadAvatarData>();
  const Authorization = useMemo(() => cacheMng.getItem('token'), []);

  const beforeUpload = useCallback((file: any) => {
    const isJpgOrPng = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
    if (!isJpgOrPng) {
      message.error('只能上传JPG或PNG格式图片');
    }
    const isLt3K = file.size / 1024 < 300;
    if (!isLt3K) {
      message.error('图片必须小于300KB');
    }
    return isJpgOrPng && isLt3K;
  }, []);

  const onChange = useCallback((info: any) => {
    if (info.file.status === 'uploading') {
      handleLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      handleLoading(false);
      if (info.file.response?.status === 'A000') {
        const { id, url } = info.file.response.data;
        handleUpload({ id, url });
      }
    }
  }, []);

  const onPreview = useCallback(async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  }, []);

  const onCancel = useCallback(() => {
    if (avatarUrl) {
      handleUpload(getAvatar(avatarUrl));
    } else {
      handleUpload(undefined);
    }
  }, [avatarUrl]);

  useEffect(() => {
    if (avatarUrl) {
      handleUpload(getAvatar(avatarUrl));
    }
  }, [avatarUrl]);

  return (
    <Flex className={styles.container} direction="column" justify="center">
      <ImgCrop rotate>
        <Upload
          action="https://api.yiqioa.com/v1/dms/repo/avatar/file"
          name="file"
          method="POST"
          listType="picture-card"
          showUploadList={false}
          disabled={disabled}
          headers={{ Authorization }}
          beforeUpload={beforeUpload}
          onChange={onChange}
          onPreview={onPreview}
        >
          {uploadData?.url ? (
            <img src={uploadData.url} alt="头像" style={{ width: '100%' }} />
          ) : (
            <div>
              {loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>上传头像</div>
            </div>
          )}
        </Upload>
      </ImgCrop>
      {uploadData?.url && (
        <Flex className={styles.btnWrapper} justify="center">
          {uploadData.url === avatarUrl ? (
            <Typography.Text type="secondary">点击更换头像</Typography.Text>
          ) : (
            <>
              <Button type="link" onClick={() => onSave(uploadData)}>
                保存
              </Button>
              <Button type="text" onClick={onCancel}>
                取消
              </Button>
            </>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default UploadAvatar;
