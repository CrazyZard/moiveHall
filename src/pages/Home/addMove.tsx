import AddMovie from '@/components/AddMovie';
import { storage } from '@/utils/storage';
import { Button, Drawer } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  hallSeat1,
  hallSeat2,
  hallSeat3,
  hallSeat4,
  hallSeat5,
  hallSeat6,
  hallSeat7,
} from './contant';
import './index.less';

const AddMove: React.FC<{ setC: any }> = ({ setC }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [filmOptions, setFilmOptions] = useState<any>([]);
  const [filterHallValue, setHallValue] = useState<string>('');
  const [filmValue, setFilmValue] = useState<string>('');
  const seat: Record<string, any[][]> = {
    1: hallSeat1,
    2: hallSeat2,
    3: hallSeat3,
    4: hallSeat4,
    5: hallSeat5,
    6: hallSeat6,
    7: hallSeat7,
  };
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  interface Item {
    key: string;
    name: string;
    type: string;
    price: number;
    time: string;
    hall?: string;
  }

  useEffect(() => {
    if (!open) return;
    const storageGet = storage.get('movieList');
    if (!storageGet) return;
    const originData = JSON.parse(storageGet);
    originData.forEach((item: any) => {
      item.time = dayjs(item.time, 'HH:mm');
    });
    setData(originData);
  }, [open]);

  useEffect(() => {
    let tempKey: any = {};
    let filmNameOptions: any = [];
    data.forEach((item) => {
      if (tempKey[item.name]) return;
      tempKey[item.name] = 1;
      filmNameOptions.push({ text: item.name, value: item.name });
    });
    setFilmOptions(filmNameOptions);
  }, [data]);

  const handleAdd = () => {
    const newData: Item = {
      key: String((Math.random() * 1000000000).toFixed(0)),
      name: filmValue ? filmValue : '请输入',
      hall: filterHallValue ? filterHallValue : '1',
      price: 0,
      time: dayjs('00:00', 'HH:mm'),
      type: '请输入',
    };
    setData([...data, newData]);
  };

  const handleCopy = (row: any, index: number) => {
    const newRow: Item = {
      key: String((Math.random() * 1000000000).toFixed(0)),
      name: row.name,
      hall: row.hall,
      price: row.price,
      time: row.time,
      type: row.type,
    };
    const newData = [...data];
    newData.splice(index, 0, newRow);
    setData(newData);
  };

  const handleDelete = (key: React.Key) => {
    const newData = data.filter((item: any) => item.key !== key);
    if (storage.get(String(key))) {
      storage.remove(String(key));
    }
    setData(newData);
  };

  const handleSaveAll = () => {
    data.forEach((item: any) => {
      item.time = item.time.format('HH:mm');
      if (!storage.get(item.key)) {
        const emptySeat = seat[item.hall];
        storage.set(item.key, JSON.stringify(emptySeat));
      }
    });
    storage.set('movieList', JSON.stringify(data));
    setC((v) => v + 1);
    onClose();
  };

  const handleSave = (key: React.Key, row: any) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setData(newData);
    } else {
      newData.push(row);
      setData(newData);
    }
  };

  const renderFooter = () => {
    return (
      <div>
        <Button type="primary" onClick={handleSaveAll}>
          保存
        </Button>
        <Button style={{ marginLeft: '8px' }} onClick={onClose}>
          取消
        </Button>
      </div>
    );
  };
  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        当前排片
      </Button>
      {open ? (
        <Drawer
          destroyOnClose={true}
          title="当前排期"
          placement="right"
          onClose={onClose}
          open={open}
          width={'100%'}
          footer={renderFooter()}
        >
          <AddMovie
            setFilmValue={setFilmValue}
            setHallValue={setHallValue}
            filmOptions={filmOptions}
            originData={data}
            handleAdd={handleAdd}
            handleCopy={handleCopy}
            handleDelete={handleDelete}
            handleSave={handleSave}
          ></AddMovie>
        </Drawer>
      ) : null}
    </>
  );
};

export default AddMove;
