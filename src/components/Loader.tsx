import clsx from 'clsx';
import { CSSProperties } from 'react';

type Props = {
  className?: string;
  style?: CSSProperties;
};

export const Loader = (props: Props) => {
  const style = props.style || null;

  return (
    <svg
      className={clsx('text-sm stroke-slate-400', props.className)}
      style={{
        strokeWidth: '3',
        ...style,
      }}
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg">
      <style
        dangerouslySetInnerHTML={{
          __html:
            '.spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}.spinner_V8m1 circle{stroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}',
        }}
      />
      <g className="spinner_V8m1">
        <circle cx="12" cy="12" r="9.5" fill="none" />
      </g>
    </svg>
  );
};
