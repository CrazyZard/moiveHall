import { Col, Layout } from 'antd';
import React from 'react';
import './index.less';

interface Props {
  name: number[];
  status: number;
}

// 脚手架示例组件
const CoupleSeat: React.FC<Props> = (props) => {
  const { name, status } = props;

  return (
    <Layout>
      <Col>
        <div className={`couple-seat-${status}`}>
          <span>{name[0]}</span>
          <span>{name[1]}</span>
        </div>
      </Col>
    </Layout>
  );
};

export default CoupleSeat;
