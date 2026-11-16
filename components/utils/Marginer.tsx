'use client';

export default function Marginer(props: { horizontal?: string; vertical?: string }){
  return (
    <div style={{
      width: props.horizontal !== undefined ? props.horizontal : "10px",
      height: props.vertical !== undefined ? props.vertical : "10px"
    }}></div>
  );
}
