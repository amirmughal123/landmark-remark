import React, { Component } from 'react';
import Geosuggest from 'react-geosuggest';
import '../stylesheet/App.css';
import { Row, Col, Form, Icon, Input, Button, Card, notification } from 'antd';

const FormItem = Form.Item;

class Login extends Component {

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
        console.log('Received values of form: ', values);
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
            this.openNotificationWithIcon('success', msg);
          } else {
            this.openNotificationWithIcon('error', msg);
          }
        });
      }
    });
  }

  onSuggestSelect(suggest) {
    console.log(suggest);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row type="flex" justify="center" align="middle" style={{ height: '600px' }}>
        <Col>
          <Card title="LOGIN" bordered={true} hoverable={true}>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Geosuggest
                ref={el=>this._geoSuggest=el}
                placeholder="Start typing!"
                onSuggestSelect={this.onSuggestSelect}
                location={new google.maps.LatLng(53.558572, 9.9278215)}
                radius="20" 
              />
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

const InputField = ({ fieldName, placeholder, message, required, rules, getFieldDecorator }) => {
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
