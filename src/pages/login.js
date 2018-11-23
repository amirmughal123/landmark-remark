import React, { Component } from 'react';
import '../stylesheet/App.css';
import { Row, Col, Form, Icon, Input, Button, Card, notification } from 'antd';
// cookies to save user and use all over app
import cookie from 'react-cookies'

const FormItem = Form.Item;

class Login extends Component {

  componentWillMount() {
    console.log(cookie.load('user'), 'cookies user');
    if(cookie.load('user')) {
      const { history } = this.props;
      history.push('/dashboard');
    }
  }

  openNotificationWithIcon = (type, msg) => {
    notification[type]({
      message: 'Authentication',
      description: msg,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // fetch used for calling server to save users data
        fetch('http://localhost:4000/api/v1/users', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(values)
        })
        .then(response => response.json())
        .then(res => {
          const { status, msg, data } = res;
          if(status) {
            cookie.save('user', data, { path: '/' });
            this.openNotificationWithIcon('success', msg);
            const { history } = this.props;
            history.push('/dashboard');
          } else {
            this.openNotificationWithIcon('error', msg);
          }
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row type="flex" justify="center" align="middle" style={{ height: '600px' }}>
        <Col>
          <Card title="LOGIN" bordered={true} hoverable={true}>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <InputField
                fieldName='userName'
                placeholder='Username'
                required={true}
                getFieldDecorator={getFieldDecorator}
                rules={[{ 
                  required: true, 
                  message: 'Please input your username!', 
                  whitespace: true 
                }]}
              />
              <InputField
                fieldName='email'
                placeholder='Email'
                required={true}
                getFieldDecorator={getFieldDecorator}
                rules={[{
                  type: 'email', message: 'The input is not valid E-mail!',
                }, {
                  required: true, message: 'Please input your E-mail!',
                }]}
              />
              <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Log in
                </Button>
              </FormItem>
            </Form>
          </Card>
        </Col>
      </Row>
    )
  }
}

export default Form.create()(Login);

const InputField = ({ fieldName, placeholder, rules, getFieldDecorator }) => {
  return (
    <FormItem>
      {getFieldDecorator(fieldName, {
        rules,
      })(
        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder={placeholder} />
      )}
    </FormItem>
  )
}
