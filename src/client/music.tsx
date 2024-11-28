import axios from 'axios';
import React, { useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import { color } from './util/define';
import { Title } from './util/text';

const StyledBg = styled.div`
  background-color: ${color.box};
  min-height: 100vh;
`;
const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 200px 100px;
`;

export default function Music() {
  const [musicSource, setMusicSource] = useState<
    { inputName: string; volume: number }[]
  >([]);
  useLayoutEffect(() => {
    axios.get(`/music/get`).then(({ data }) => {
      setMusicSource(data);
    });
  }, []);

  return (
    <>
      <Title style={{ margin: '30px' }}>음악 볼륨 조절</Title>
      {musicSource.map((val) => (
        <MusicSource inputName={val.inputName} volume={val.volume} />
      ))}
    </>
  );
}

const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

function MusicSource({
  inputName,
  volume,
}: {
  inputName: string;
  volume: number;
}) {
  const [nowvolume, setVolume] = useState<number>(volume);
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(e.target.value as any);
    axios.post(`/music/set`, { inputName, volume: e.target.value });
  };
  return (
    <FlexDiv>
      <Title style={{ marginRight: '10px' }}>{inputName}</Title>
      <input
        onChange={onChangeHandler}
        type="range"
        min="-60"
        max="0"
        step="0.5"
        value={nowvolume}
      />
    </FlexDiv>
  );
}
