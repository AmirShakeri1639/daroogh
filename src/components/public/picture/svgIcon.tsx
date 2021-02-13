import React, { useState, useEffect } from 'react';

interface Props {
    fileName: string;
    className?: string;
  }

  const SvgIcon: React.FC<Props> = (props) => {
    const { fileName, className = '' } = props;

    return (
        <>
          <img src={"./"+fileName+".svg"} className={ className }  style={{width:"24px" , filter:"invert(1)", transform: "scaleX(-1)"}}/>
        </>
      );

  }

  export default SvgIcon;