import React, { useState } from 'react';
import { Button, Form, Input, Select, Space, Image, Upload } from 'antd';
import {  RedoOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './index.less';
import { AdPositionList, PlatformList, LanguageList } from '@/constant/config';
import { createAd } from '@/model/api';

const { TextArea } = Input;

const App: React.FC = () => {
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
      "endTime": ''
    })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const [title, setTitle] = useState("")
  const [country, setCountry] = useState("en")
  const [platform, setPlatform] = useState("1")
  const [pos, setPosition] = useState("homepage")
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [imageUrl, setLink] = useState("")
  const [description, setDesc] = useState("")
  
  // const [username, setName] = useState("")
  // const [password, setPassworrd] = useState("")

  const handleChange = () => {

  }
  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <Form
          name="Create Ad"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Ad Title"
            name="title"
            rules={[{ required: true, message: 'Please input your Ad Title!' }]}
          >
            <Input value={title} placeholder="Input Ad Title"  onChange={(e) => {setTitle(e.target.value)}} />
          </Form.Item>

          <Form.Item
            label="Language of delivery"
            name="language"
            rules={[{ required: true, message: 'Please select your delivery language!' }]}
          >
            <Select
              placeholder="delivery language"
              value={country}
              onChange={(e) => {
                setCountry(e)
              }}
              options={LanguageList}
            />
          </Form.Item>

          <Form.Item
            label="Platform of delivery"
            name="platform"
            rules={[{ required: true, message: 'Please select your delivery platform!' }]}
          >
            <Select
              placeholder="delivery platform"
              // defaultValue={"1"}
              value={platform}
              onChange={(e) => {
                setPlatform(e)
              }}
              options={PlatformList}
            />
          </Form.Item>
          <Form.Item
            label="Ad position"
            name="pos"
            rules={[{ required: true, message: 'Please input your Ad position!' }]}
          >
            <Select
              placeholder="Ad position"
              value={pos}
              onChange={(e) => {
                setPosition(e)
              }}
              options={AdPositionList}
            />
            
          </Form.Item>

          <div style={{position: 'relative', marginBottom: '20px', display: 'flex', justifyContent: 'flex-end'}}>
            <Image
              width={300}
              src={require('../../../public/img/home.png')}
            />
          </div>

          <Form.Item label="Ad Size" style={{ marginBottom: 0 }}>
            <Form.Item
              name="width"
              rules={[{ required: true , message: 'Please enter Width!' }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <Input type='number' value={width} onChange={(e) => {setWidth(e.target.value)}}  placeholder="Input Ad Width" />
            </Form.Item>
            <Form.Item
              name="height"
              rules={[{ required: true , message: 'Please enter Height!'}]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
            >
              <Input type='number' value={height} onChange={(e) => {setHeight(e.target.value)}} placeholder="Input Ad Height" />
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Ad Link"
            name="link"
            rules={[{ required: true, message: 'Please input your Ad Link!' }]}
          >
            <Input value={imageUrl} onChange={(e) => {setLink(e.target.value)}} placeholder="Input Ad Link"  />
          </Form.Item>

          {/* <Form.Item
            label="Ad Image"
            name="image"
            rules={[{ required: true, message: 'Please input your Ad Link!' }]}
          >
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
            </Upload>
          </Form.Item> */}

          {/* <Form.Item
            label="Ad Customer"
            name="customer"
            rules={[{ required: true, message: 'Please input your Ad Customer!' }]}
          >
            <Input placeholder="Input Ad Customer" onChange={(e) => {setName(e.target.value)}} />
          </Form.Item> */}

          <Form.Item
            label="Ad Description"
            name="description"
            rules={[{ required: false, message: 'Please input your Ad Description!' }]}
          >
            <TextArea value={description} onChange={(e) => {setDesc(e.target.value)}} placeholder="Input Ad Description" rows={4} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space wrap style={{ marginBottom: 16 }}>
              <Button type="primary"  htmlType="submit">
                <PlusOutlined />
                Create
              </Button>
              <Button>
                <RedoOutlined />
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default App;
