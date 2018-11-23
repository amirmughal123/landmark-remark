import React, { Component } from 'react';
import { Layout, Form, Icon, Input, Button, notification } from 'antd';
import Geosuggest from 'react-geosuggest';
import cookie from 'react-cookies';
import LandMap from './Dashboard/Map';


const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;

class Dashboard extends Component {

  constructor() {
    super();

    this.state = {
      location: {},
      notes: []
    }
  }

  componentWillMount() {
    if(!cookie.load('user')) {
      const { history } = this.props;
      history.push('/');
    }
  }

  getNotes() {
    fetch('http://localhost:4000/api/v1/notes', {
      method: 'GET',
    })
    .then(response => response.json())
    .then(res => {
      const { status, msg, data } = res;
      if(data && data.length > 0) {
        this.setState({ notes: data });
      }
    });
  }

  hasErrors(fieldsError){
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  openNotificationWithIcon = (type, msg, title) => {
    notification[type]({
      message: title,
      description: msg,
    });
  };

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
    this.getNotes();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { lat, lng } = this.state.location;
        if(!lat || !lng ) {
          this.openNotificationWithIcon('error', 'Please change or set location', 'Location');
        } else {
          const { location } = this.state;
          const user = cookie.load('user');
          // fetch used for calling server to save users data
          fetch('http://localhost:4000/api/v1/notes', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ ...values, location, userId: user._id })
          })
          .then(response => response.json())
          .then(res => {
            const { status, msg, data } = res;
            if(status) {
              this.openNotificationWithIcon('success', msg, 'Note');
            } else {
              this.openNotificationWithIcon('error', msg, 'Note');
            }
          });
        }
      }
    });
  }

  onSuggestSelect = (suggest) => {
    const { location } = suggest;
    this.setState({ location })
  }

  render() {
    const { notes } = this.state;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const descriptionError = isFieldTouched('description') && getFieldError('description');

    return (
      <Layout>
        <Content>
          <h2 className='header-notes'>Notes</h2>
          <Form layout="inline" onSubmit={this.handleSubmit} className='form-layout'>
            <InputField 
              validateStatus={userNameError ? 'error' : ''}
              help={userNameError || ''}
              rules= {[{ required: true, message: 'Please input username of Note!' }]}
              placeholder="Username of Note"
              fieldName='userName'
              getFieldDecorator={getFieldDecorator}
              type='text'
              icon='user'
            />
             <InputField 
              validateStatus={descriptionError ? 'error' : ''}
              help={descriptionError || ''}
              rules= {[{ required: true, message: 'Please input Description!' }]}
              placeholder="Description of Note"
              fieldName='description'
              getFieldDecorator={getFieldDecorator}
              type='textarea'
              icon=''
            />
            <Geosuggest
              ref={el=>this._geoSuggest=el}
              placeholder="Select Location"
              style={{ width: '40%' }}
              onSuggestSelect={(e) => this.onSuggestSelect(e)}
              location={new google.maps.LatLng(53.558572, 9.9278215)}
              radius="20" 
            />
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                disabled={this.hasErrors(getFieldsError())}
              >
                Add Note
              </Button>
            </FormItem>
          </Form>
        </Content>
        <Footer>
          <LandMap
            notes={notes} 
          />
        </Footer>
      </Layout>
    )
  }
}

export default Form.create()(Dashboard);

const InputField = ({ fieldName, placeholder, rules, getFieldDecorator, validateStatus, help, type, icon }) => {
  return (
    <FormItem
      validateStatus={validateStatus}
      help={help}
    >
      {getFieldDecorator(fieldName, {
        rules,
      })(
        <Input type={type} prefix={<Icon type={icon} style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder={placeholder} />
      )}
    </FormItem>
  )
}
