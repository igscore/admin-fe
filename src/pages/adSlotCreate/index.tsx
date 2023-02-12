import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Space, Image, Upload } from 'antd';
import {  RedoOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './index.less';
import { AdPositionList, PlatformList, LanguageList } from '@/constant/config';
import { createAd, getAdDetail } from '@/model/api';
import { history } from 'umi';

const { TextArea } = Input;

const App: React.FC = (props) => {
  const [id, setId] = useState(props.location.query.id)
  const [isCreate, setIsCreate] = useState(!id)


  const [detail, setDetail] = useState({})

  const onFinish = (values: any) => {
    console.log('Success:', values);
    const {
      title,
      country,
      platform,
      width,
      height,
      pos,
      imageUrl,
      description
    } = values
    createAd({
      "name": title,
      "country": country,
      "client": "123",
      "platform": platform,
      "position": pos,
      "length": height,
      "width": width,
      "status": 0,
      "imageUrl": imageUrl,
      "description": description,
      "modifiedBy": "igscore",
      "createdBy": "igscore",
      "startTime": '',
      "endTime": '',
      id: detail.id
    }).then((d) => {
      history.replace('/')
    })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const [title, setTitle] = useState("")
  const [country, setCountry] = useState("en")
  const [platform, setPlatform] = useState("web")
  const [pos, setPosition] = useState("homepage")
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [imageUrl, setLink] = useState("")
  const [description, setDesc] = useState("")

  useEffect(() => {
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
        setWidth(result.width)
        setLink(result.imageUrl)
        setDesc(result.description)
      }
    })
  }, [id])

  console.log(title)

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
            <span className={styles.lable}>Language of delivery: </span>
            <Select
              placeholder="delivery language"
              value={country}
              onChange={(e) => {
                setCountry(e)
              }}
              style={{width: '408px'}}
              options={LanguageList}
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
              options={AdPositionList}
            />
          </div>

          <div style={{position: 'relative', marginBottom: '20px', display: 'flex', justifyContent: 'flex-end'}}>
            <Image
              width={300}
              src={require('../../../public/img/home.png')}
            />
          </div>

          <div className={styles.rowline}>
            <span className={styles.lable}>Ad Size: </span>
            <Input type='number' value={width} onChange={(e) => {setWidth(e.target.value)}}  placeholder="Input Ad Width" />
          </div>

          <div className={styles.rowline}>
            <span className={styles.lable}>Ad Link: </span>
            <Input value={imageUrl} onChange={(e) => {setLink(e.target.value)}} placeholder="Input Ad Link"  />
          </div>

          <div className={styles.rowline}>
            <span className={styles.lable}>Ad Description: </span>
            <TextArea value={description} onChange={(e) => {setDesc(e.target.value)}} placeholder="Input Ad Description" rows={4} />
          </div>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space wrap style={{ marginBottom: 16 }}>
              <Button type="primary"  htmlType="submit">
                <PlusOutlined />
                {isCreate ? 'Create' : 'Update'}
              </Button>
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
