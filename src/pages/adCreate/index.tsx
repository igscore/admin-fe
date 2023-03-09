import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Select, Space, Image, Upload, notification } from 'antd';
import { RedoOutlined, PlusOutlined, LoadingOutlined, EditOutlined } from '@ant-design/icons';
import styles from './index.less';
import { PlatformList, AdImageInfoMaps, CreateErrorMessage } from '@/constant/config';
import { createAd, getAdDetail, getAdList, updateAd } from '@/model/api';
import { history } from 'umi';
import { CountryList } from '@/constant/country';

const { TextArea } = Input;

export const generateUuid = (prefix: string, length: number) => {
  const uuidStr = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
  const len = !length ? uuidStr.length : length;
  let date = Date.now();
  const uuid = uuidStr.replace(/[xy]/g, (c) => {
    const r = (date + Math.random() * 16) % 16 | 0;
    date = Math.floor(date / 16);
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
  });
  return `${!prefix ? '' : prefix}${uuid.slice(0, len)}`;
};

const AdCreate: React.FC<any> = (props) => {
  const { id, copy } = props.location.query;
  const { isCreated, isCopy } = useMemo(
    () => ({
      isCopy: copy === '1',
      isCreated: copy === '1' || !id,
    }),
    [id, copy],
  );
  const [detail, setDetail] = useState<any>({});
  const [title, setTitle] = useState<string>('');
  const [country, setCountry] = useState<string>('US');
  const [platform, setPlatform] = useState<string>('web');
  const [position, setPosition] = useState<string>('');
  const [imageUrl, setLink] = useState<string>('');
  const [jumpUrl, setJumpUrl] = useState<string>('');
  const [description, setDesc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const positionList = useMemo(
    () => Object.keys(AdImageInfoMaps[platform]).map((value) => ({ value, label: value })),
    [platform],
  );
  const imgInfo = useMemo(() => AdImageInfoMaps[platform][position], [platform, position]);

  const checkIsEmpty = useCallback(() => {
    const values = [title, imageUrl];
    const valueKeys = ['title', 'imageUrl'];
    for (let i = 0; i < values.length; i++) {
      if (!values[i]) {
        notification.error({
          key: 'form valid',
          message: 'Error',
          description: CreateErrorMessage[valueKeys[i]],
        });
        return false;
      }
    }
    return true;
  }, [title, imageUrl]);

  const onCreate = useCallback(() => {
    if (!checkIsEmpty()) {
      return false;
    }

    createAd({
      name: title,
      country,
      platform,
      position: position,
      width: imgInfo.width,
      length: imgInfo.height,
      status: 0,
      imageUrl,
      jumpUrl,
      description,
      startTime: '',
      endTime: '',
    })
      .then(() => {
        notification.success({
          key: 'success',
          message: 'Success',
          description: 'Created successfully.',
        });
        history.replace('/');
      })
      .catch(() => {
        notification.error({
          key: 'error create',
          message: 'Error',
          description: 'please try again',
        });
      });
  }, [title, imageUrl]);

  const onEdit = useCallback(() => {
    if (!checkIsEmpty()) {
      return false;
    }
    updateAd({
      id: detail.id || '',
      name: title,
      country: country,
      platform,
      position,
      length: imgInfo.height,
      width: imgInfo.width,
      status: typeof detail.status === 'number' ? detail.status : 1,
      imageUrl,
      jumpUrl,
      description,
      startTime: '',
      endTime: '',
    })
      .then(() => {
        notification.success({
          key: 'success',
          message: 'Success',
          description: 'Modified successfully.',
        });
        history.replace('/');
      })
      .catch(() => {
        notification.error({
          key: 'error update',
          message: 'Error',
          description: 'Please try again.',
        });
      });
  }, [detail, title, country, platform, position, imageUrl, jumpUrl, description]);

  const handleChange = useCallback((info: any) => {
    console.log(info);
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'error') {
      // Get this url from response in real world.
      setLoading(false);
      console.log(info.file.name);
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setLoading(false);
      setLink(`https://www.igscore.com/static-images/ads/${info.file.name}`);
    }
  }, []);

  const beforeUpload = useCallback((file: File) => {
    return Promise.resolve(
      new File([file], `${generateUuid('igad', 10)}_${file.name}`, {
        type: file.type,
      }),
    );
  }, []);

  useEffect(() => {
    setPosition(positionList[0].value);
  }, [positionList]);

  useEffect(() => {
    getAdList();
  }, []);

  useEffect(() => {
    if (!isCreated || isCopy) {
      getAdDetail(id).then(({ result }: any) => {
        if (result) {
          console.log(result);
          setDetail(result);
          setTitle(result.name);
          setCountry(result.country);
          setPlatform(result.platform);
          setLink(result.imageUrl);
          setJumpUrl(result.jumpUrl);
          setDesc(result.description);
          setTimeout(() => {
            setPosition(result.position);
          });
        }
      });
    }
  }, [id, isCreated, isCopy]);

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1>{isCreated ? 'Create AD' : 'Edit AD'}</h1>
        <div>
          <div className={styles.row}>
            <span className={styles.label}>Title: </span>
            <Input value={title} placeholder="please input the title" onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Country of delivery: </span>
            <Select
              style={{ width: 408 }}
              options={CountryList}
              value={country}
              placeholder="country of delivery"
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              onChange={(e) => setCountry(e)}
            />
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Platform of delivery: </span>
            <Select
              style={{ width: 408 }}
              options={PlatformList}
              value={platform}
              placeholder="platform of delivery"
              onChange={(e) => setPlatform(e)}
            />
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Position of delivery: </span>
            <Select
              style={{ width: 408 }}
              placeholder="position of delivery"
              options={positionList}
              value={position}
              onChange={(e) => setPosition(e)}
            />
          </div>

          <div className={styles.row} style={{ justifyContent: 'flex-start' }}>
            <span className={styles.label} style={{ width: 170 }}>
              Position Preview:{' '}
            </span>
            <div>
              <Image style={{ maxWidth: 230, maxHeight: 120 }} src={imgInfo?.demoImg || ''} />
            </div>
          </div>

          <div className={styles.row} style={{ color: '#c1272d' }}>
            <span className={styles.label}>AD Image Size: </span>
            <div style={{ width: 408 }}>
              {imgInfo?.width || 0}px(width) * {imgInfo?.height || 0}px(height)
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>AD Image Url: </span>
            <Input
              value={imageUrl}
              onChange={(e) => {
                setLink(e.target.value);
              }}
              placeholder="Input Link or Upload a Image file"
            />
          </div>
          <div className={styles.flexRight}>
            <Upload
              accept="image/*"
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://api.igscore.com:8080/admin/user/image/upload"
              onChange={handleChange}
              beforeUpload={beforeUpload}
              withCredentials={true}
            >
              {imageUrl ? (
                <img src={imageUrl} referrer="no-referrer|origin|unsafe-url" alt="avatar" style={{ width: '100%' }} />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Access url: </span>
            <Input
              value={jumpUrl}
              onChange={(e) => {
                setJumpUrl(e.target.value);
              }}
              placeholder="please input the url"
            />
          </div>

          <div className={styles.row}>
            <span className={styles.label}>AD Description: </span>
            <TextArea
              value={description}
              onChange={(e) => {
                setDesc(e.target.value);
              }}
              placeholder="please input the description"
              rows={4}
            />
          </div>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space wrap style={{ margin: '20px 0' }}>
              {isCreated ? (
                <Button type="primary" onClick={onCreate}>
                  <PlusOutlined />
                  Create
                </Button>
              ) : (
                <Button type="primary" onClick={onEdit}>
                  <EditOutlined />
                  Update
                </Button>
              )}
              <Button onClick={() => history.replace('/')}>
                <RedoOutlined />
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default AdCreate;
