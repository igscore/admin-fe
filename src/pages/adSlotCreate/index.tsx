import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Space, Image, Upload, notification } from 'antd';
import {  RedoOutlined, PlusOutlined, LoadingOutlined, EditOutlined } from '@ant-design/icons';
import styles from './index.less';
import { AdPositionList, PlatformList, PositionSizeMap, CreateErrorMessage } from '@/constant/config';
import { createAd, getAdDetail, updateAd } from '@/model/api';
import { history } from 'umi';
import { CountryList } from '@/constant/country';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

const { TextArea } = Input;

const PositionList = AdPositionList.map((item) => {
  return {
    value: item,
    label: item
  }
})

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const App: React.FC = (props) => {
  const [id, setId] = useState(props.location.query.id)
  const [isCreate, setIsCreate] = useState(!id)


  const [detail, setDetail] = useState({})

  const [title, setTitle] = useState("")
  const [country, setCountry] = useState("US")
  const [platform, setPlatform] = useState("web")
  const [pos, setPosition] = useState(PositionList[0].value)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [imageUrl, setLink] = useState("")
  const [jumpUrl, setJumpUrl] = useState("")
  const [description, setDesc] = useState("")
  const [loading, setLoading] = useState(false);

  const checkIsEmpty = () => {
    const values = [title, imageUrl]
    const valueKeys = ['title', 'imageUrl']
    for(let i = 0; i < values.length; i++) {
      if(!values[i]) {
        notification.error({
          key: 'form valid',
          message: 'Error',
          description: CreateErrorMessage[valueKeys[i]],
        })
        return false 
      }
    }
    return true
  }

  const onFinish = () => {
    if(!checkIsEmpty()) return false
    createAd({
      "name": title,
      "country": country,
      "client": "123",
      "platform": platform,
      "position": pos,
      "length": PositionSizeMap[pos].height,
      "width": PositionSizeMap[pos].width,
      "status": 1,
      "imageUrl": imageUrl,
      jumpUrl,
      "description": description,
      "modifiedBy": "igscore",
      "createdBy": "igscore",
      "startTime": '',
      "endTime": ''
    }).then((d) => {
      notification.success({
        key: 'success',
        message: 'Success',
        description: 'Create Successed',
      })
      history.replace('/')
    })
    .catch((e) => {
      notification.error({
        key: 'error create',
        message: 'Error',
        description: 'please try again',
      })
    })
  };

  const onUpdateFinish = () => {
    if(!checkIsEmpty()) return false
    updateAd({
      "name": title,
      "country": country,
      "client": "123",
      "platform": platform,
      "position": pos,
      "length": PositionSizeMap[pos].height,
      "width": PositionSizeMap[pos].width,
      "status": 1,
      "imageUrl": imageUrl,
      jumpUrl,
      "description": description,
      "modifiedBy": "igscore",
      "createdBy": "igscore",
      "startTime": '',
      "endTime": '',
      id: detail.id || ''
    }).then((d) => {
      notification.success({
        key: 'success',
        message: 'Success',
        description: 'Update Successed',
      })
      history.replace('/')
    })
    .catch((e) => {
      notification.error({
        key: 'error update',
        message: 'Error',
        description: 'please try again',
      })
    })
  };

  useEffect(() => {
    if(!id) return
    getAdDetail(id)
    .then((d) => {
      const {result} = d
      if(result) {
        console.log(result)
        setDetail(result)
        setTitle(result.name)
        setCountry(result.country)
        setPlatform(result.platform)
        setPosition(result.position)
        // setWidth(result.width)
        // setHeight(result.length)
        setLink(result.imageUrl)
        setJumpUrl(result.jumpUrl)
        setDesc(result.description)
      }
    })
  }, [id])

  console.log(title)

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setLink(`https://www.igscore.com/static-images/ads/${url}`);
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1>{isCreate ? 'Create' : 'Update'}</h1>
        <div
        >
          <div className={styles.rowline}>
            <span className={styles.lable}>Ad Title: </span>
            <Input defaultValue={title} value={title} placeholder="Input Ad Title"  onChange={(e) => {setTitle(e.target.value)}} />
          </div>

          <div className={styles.rowline}>
            <span className={styles.lable}>Country of delivery: </span>
            <Select
              placeholder="delivery country"
              value={country}
              onChange={(e) => {
                console.log(e)
                setCountry(e)
              }}
              style={{width: '408px'}}
              options={CountryList}
            />
          </div>

          <div className={styles.rowline}>
            <span className={styles.lable}>Platform of delivery: </span>
            <Select
              placeholder="delivery platform"
              // defaultValue={"1"}
              value={platform}
              onChange={(e) => {
                setPlatform(e)
              }}
              style={{width: '408px'}}
              options={PlatformList}
            />
          </div>

          <div className={styles.rowline}>
            <span className={styles.lable}>Ad position: </span>
            <Select
              placeholder="Ad position"
              value={pos}
              onChange={(e) => {
                setPosition(e)
              }}
              style={{width: '408px'}}
              options={PositionList}
            />
          </div>

          <div style={{position: 'relative', marginBottom: '20px', display: 'flex', justifyContent: 'flex-end'}}>
            <Image
              width={300}
              src={require('../../../public/img/home.png')}
            />
          </div>

          {/* <div className={styles.rowline}>
            <span className={styles.lable}>Ad Width: </span>
            <Input type='number' value={height} onChange={(e) => {setHeight(e.target.value)}}  placeholder="Input Ad Width" />
          </div>

          <div className={styles.rowline}>
            <span className={styles.lable}>Ad Height: </span>
            <Input type='number' value={width} onChange={(e) => {setWidth(e.target.value)}}  placeholder="Input Ad Width" />
          </div> */}

          <div className={styles.rowline}>
            <span className={styles.lable}>Ad Image Url: </span>
            <Input value={imageUrl} onChange={(e) => {setLink(e.target.value)}} placeholder="Input Link or Upload a Image file"  />
          </div>
          <div className={styles.flexright}>
            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://api.igscore.com:8080/admin/user/image/upload"
              onChange={handleChange}
              withCredentials={true}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>  
            </div>  

          <div className={styles.rowline}>
            <span className={styles.lable}>Ad Link: </span>
            <Input value={jumpUrl} onChange={(e) => {setJumpUrl(e.target.value)}} placeholder="Input Ad Link"  />
          </div>

          <div className={styles.rowline}>
            <span className={styles.lable}>Ad Description: </span>
            <TextArea value={description} onChange={(e) => {setDesc(e.target.value)}} placeholder="Input Ad Description" rows={4} />
          </div>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space wrap style={{ marginBottom: 16 }}>
              {
                isCreate ? (
                <Button type="primary"  onClick={onFinish}>
                  <PlusOutlined />
                  Create
                </Button>
                ) : (
                <Button type="primary"  onClick={onUpdateFinish}>
                  <EditOutlined />
                  Update
                </Button>
                )
              }
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

export default App;
