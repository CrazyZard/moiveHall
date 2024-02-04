import { Col, Layout } from 'antd';
import React from 'react';
import './index.less';

interface Props {
  name: string;
  status: string;
}

// 脚手架示例组件
const SingleSeat: React.FC<Props> = (props) => {
  const { name, status } = props;

  return (
    <Layout>
      <Col>
        <div className={`single-seat-${status}`}>{name}</div>
      </Col>
    </Layout>
  );
};

export default SingleSeat;
