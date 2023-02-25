import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Image,
  Upload,
  notification,
} from 'antd';
import {
  RedoOutlined,
  PlusOutlined,
  LoadingOutlined,
  EditOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import {
  AdPositionList,
  PlatformList,
  AdImageSizeMaps,
  CreateErrorMessage,
} from '@/constant/config';
import { createAd, getAdDetail, getAdList, updateAd } from '@/model/api';
import { history } from 'umi';
import { CountryList } from '@/constant/country';

const { TextArea } = Input;

const PositionList = AdPositionList.map((item) => {
  return {
    value: item,
    label: item,
  };
});

export const generateUuid = (prefix: string, length: number) => {
  const uuidStr = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
  const len = !length ? uuidStr.length : length;
  let date = Date.now();
  const uuid = uuidStr.replace(/[xy]/g, (c) => {
    const r = (date + Math.random() * 16) % 16 | 0; // eslint-disable-line no-bitwise
    date = Math.floor(date / 16);
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16); // eslint-disable-line no-bitwise
  });
  return `${!prefix ? '' : prefix}${uuid.slice(0, len)}`;
};

const AdSlotCreate: React.FC<any> = (props) => {
  const [id] = useState<string>(props.location.query.id);
  const [isCreate] = useState<boolean>(!id);
  const [detail, setDetail] = useState<any>({});
  const [title, setTitle] = useState<string>('');
  const [country, setCountry] = useState<string>('US');
  const [platform, setPlatform] = useState<string>('web');
  const [position, setPosition] = useState<string>(PositionList[0].value);
  const [imageUrl, setLink] = useState<string>('');
  const [jumpUrl, setJumpUrl] = useState<string>('');
  const [description, setDesc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getAdList();
  }, []);

  const checkIsEmpty = () => {
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
  };

  const onFinish = () => {
    if (!checkIsEmpty()) {
      return false;
    }

    createAd({
      name: title,
      country,
      client: '123',
      platform,
      position: position,
      width: AdImageSizeMaps[platform][position].width,
      length: AdImageSizeMaps[platform][position].height,
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
          description: 'Create Successed',
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
  };

  const onUpdateFinish = () => {
    if (!checkIsEmpty()) return false;
    updateAd({
      name: title,
      country: country,
      client: '123',
      platform,
      position,
      length: AdImageSizeMaps[platform][position].height,
      width: AdImageSizeMaps[platform][position].width,
      status: typeof detail.status === 'number' ? detail.status : 1,
      imageUrl,
      jumpUrl,
      description,
      startTime: '',
      endTime: '',
      id: detail.id || '',
    })
      .then(() => {
        notification.success({
          key: 'success',
          message: 'Success',
          description: 'Update Successed',
        });
        history.replace('/');
      })
      .catch(() => {
        notification.error({
          key: 'error update',
          message: 'Error',
          description: 'please try again',
        });
      });
  };

  useEffect(() => {
    if (!id) return;
    getAdDetail(id).then((d: any) => {
      const { result } = d;
      if (result) {
        console.log(result);
        setDetail(result);
        setTitle(result.name);
        setCountry(result.country);
        setPlatform(result.platform);
        setPosition(result.position);
        setLink(result.imageUrl);
        setJumpUrl(result.jumpUrl);
        setDesc(result.description);
      }
    });
  }, [id]);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleChange = (info: any) => {
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
  };

  const beforeUpload = (file: any) => {
    return Promise.resolve(
      new File([file], `${generateUuid('igad', 10)}_${file.name}`, {
        type: file.type,
      }),
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1>{isCreate ? 'Create' : 'Update'}</h1>
        <div>
          <div className={styles.rowline}>
            <span className={styles.lable}>Title: </span>
            <Input
              defaultValue={title}
              value={title}
              placeholder="please input the title"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>

          <div className={styles.rowline}>
            <span className={styles.lable}>Country of delivery: </span>
            <Select
              placeholder="country of delivery"
              value={country}
              onChange={(e) => {
                console.log(e);
                setCountry(e);
              }}
              style={{ width: '408px' }}
              options={CountryList}
            />
          </div>

          <div className={styles.rowline}>
            <span className={styles.lable}>Platform of delivery: </span>
            <Select
              placeholder="platform of delivery"
              // defaultValue={"1"}
              value={platform}
              onChange={(e) => {
                setPlatform(e);
              }}
              style={{ width: '408px' }}
              options={PlatformList}
            />
          </div>

          <div className={styles.rowline}>
            <span className={styles.lable}>Position of delivery: </span>
            <Select
              placeholder="position of delivery"
              value={position}
              onChange={(e) => {
                setPosition(e);
              }}
              style={{ width: '408px' }}
              options={PositionList}
            />
          </div>

          <div
            style={{
              position: 'relative',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Image width={300} src={require('../../../public/img/home.png')} />
          </div>

          <div className={styles.rowline}>
            <span className={styles.lable}>Ad Image Url: </span>
            <Input
              value={imageUrl}
              onChange={(e) => {
                setLink(e.target.value);
              }}
              placeholder="Input Link or Upload a Image file"
            />
          </div>
          <div className={styles.flexright}>
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
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </div>

          <div className={styles.rowline}>
            <span className={styles.lable}>Access url: </span>
            <Input
              value={jumpUrl}
              onChange={(e) => {
                setJumpUrl(e.target.value);
              }}
              placeholder="please input the url"
            />
          </div>

          <div className={styles.rowline}>
            <span className={styles.lable}>Ad Description: </span>
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
            <Space wrap style={{ marginBottom: 16 }}>
              {isCreate ? (
                <Button type="primary" onClick={onFinish}>
                  <PlusOutlined />
                  Create
                </Button>
              ) : (
                <Button type="primary" onClick={onUpdateFinish}>
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

export default AdSlotCreate;
