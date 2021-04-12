import React from 'react';
import TextWithTitle from '../TextWithTitle/TextWithTitle';

interface Props {
    offer1 : number | undefined | string ;
    offer2:number | undefined |string;
    isSmall? : boolean
}
const ShowOffer : React.FC<Props> = (props) => {
    const {offer1,offer2,isSmall} = props;
    
    return(
        <>
        {offer1 !==null && offer2 !==null  && !(offer1 === 0 || offer2 === 0) && (
            <TextWithTitle isSmal={isSmall} title="هدیه" body={`${offer1} به ${offer2}`}/>
        )}
        {offer1 === null || offer2 === null || (offer1 === 0 || offer2 === 0) && (
            <TextWithTitle isSmal={isSmall} title="هدیه" body="ندارد"/>
        )}
        </>
    )
};

export default ShowOffer;
