import React, { Component } from 'react';
import { Layout, Menu,Card, Avatar, Badge, Calendar, Row, Col, Tabs, Input } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {BrowserRouter as Router, Switch, Route,Redirect} from "react-router-dom";
import '../css/common.css';
import Title from 'antd/lib/typography/Title';
interface IProps {
  
}
interface IState {
  isSpinVisible?:boolean;
  current?:string
}
class ReceiverDashBoard extends Component<IProps,IState> {
  constructor(props:IProps) {
    super(props);
    this.state ={
      isSpinVisible:false,
      current:"1",
    };
  }
    render() {
      function callback(key:any) {
        console.log(key);
      }
      const { TabPane } = Tabs;
    const  handleClick = (e:any) => {
        console.log('click ', e);
        this.setState({ current: e.key });
      };
      const { Meta } = Card;
      const { SubMenu } = Menu;
        const { Header, Content, Sider } = Layout;
        const { current } = this.state;
        const onFinish = (values: any) => {
            console.log('Received values of form: ', values);
          }
          const { Search } = Input;
          const onSearch = (value:any) => console.log(value);
        return ( 
<Layout>
    <Header className="header">
    <Menu theme="dark" onClick={handleClick} selectedKeys={['1']}  mode="horizontal">
    <Menu.Item key="1"><Link to="/main">Home</Link></Menu.Item>
        <SubMenu key="SubMenu" icon={<SettingOutlined />} title="Events">
            <Menu.Item key="1">Events (as Owner)</Menu.Item>
            <Menu.Item key="2">Events (as Receiver)</Menu.Item>
            <Menu.Item key="3">Events (as attendee)</Menu.Item>
        </SubMenu>
      </Menu>
    </Header>
    <Layout className='layoutColor'>
    <Title className='modelTitle' level={2}>Events.</Title>
    <Row>
      <Col span={5}><Search placeholder="input search text" onSearch={onSearch} enterButton /></Col>
    </Row>
    <Tabs defaultActiveKey="1" onChange={callback}>
    <TabPane tab="Current Events" key="1">
    <Row justify="space-between">
    <Col span={6}>  
    <Card
    style={{ width: 300 }}
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
      title="Card title"
      description="This is the description"
    />
  </Card>
  </Col>
    </Row>
    </TabPane>
    <TabPane tab="Past Events" key="2">
    <Row justify="space-between">
    <Col span={6}>  
    <Card
    style={{ width: 300 }}
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
      title="Card title"
      description="This is the description"
    />
  </Card>
  </Col>
    </Row>
    </TabPane>
  </Tabs>
    </Layout>
  </Layout>
        );
    }
}
export default ReceiverDashBoard