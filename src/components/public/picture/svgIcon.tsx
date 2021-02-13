import React, { useState, useEffect } from 'react';

interface Props {
    fileName: string;
    className?: string;
    size?: string 
  }

  const SvgIcon: React.FC<Props> = (props) => {
    const { fileName, className = '' ,size = "24px"} = props;

    return (
        <>
          <img src={"./"+fileName+".svg"} className={ className } width={size}  style= { {filter:"invert(1)", transform: "scaleX(-1)"}}/>
        </>
      );

  }

  export default SvgIcon;