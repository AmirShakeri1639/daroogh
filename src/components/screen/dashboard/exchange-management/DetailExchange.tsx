import { Grid, makeStyles } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { CardInfo, ViewExchangeInterface } from '../../../../interfaces/ViewExchangeInterface';
import PharmacyDrug from '../../../../services/api/PharmacyDrug';
import Utils from '../../../public/utility/Utils';

const useStyles = makeStyles((theme) => ({
    table: {
        '& thead': {
            background: 'silver',
        },
        '& tbody>:hover': {
            background: '#ffb3b3',
        },
    }
}));

interface DetailExchangeProp {
    exchangeId: number;
    pharmacyNameA?: string;
    pharmacyNameB?: string
}
const DetailExchange: React.FC<DetailExchangeProp> = (props) => {
    const { exchangeId, pharmacyNameA = '', pharmacyNameB = '' } = props;
    const { table } = useStyles();

    const { getViewExchange } = new PharmacyDrug();

    const [viewExchange, setViewExchange] = useState<ViewExchangeInterface>();

    useEffect(() => {
        async function getdata() {
            const res = await getViewExchange(exchangeId);
            setViewExchange(res?.data);
        }
        getdata();
    }, [exchangeId]);

    const details = (items: CardInfo[], pharmacyName: string, colorName: string): JSX.Element => (<Grid item xs={6} md={6}>
        <table className={table}>
            <thead>
                <tr style={{ textAlign: 'center', color: colorName }}>
                    <th colSpan={5}>{pharmacyName}</th>
                </tr>
                <tr>
                    <th style={{ width: 35 }}>ردیف</th>
                    <th style={{ width: 400 }}>نام دارو</th>
                    <th style={{ width: 100 }}>تعداد</th>
                    <th style={{ width: 100 }}>قیمت</th>
                    <th style={{ width: 150 }}>تاریخ انقضا</th>
                </tr>
            </thead>
            <tbody style={{ border: '1px solid silver' }}>
                {items.map((item, index) => (
                    <tr>
                        <td>{++index}</td>
                        <td>{item.drug.name}({item.drug.genericName})</td>
                        <td>{item.cnt}</td>
                        <td>{Utils.numberWithCommas(item.amount)}</td>
                        <td style={{ fontSize: 12 }}>{Utils.getExpireDate(item.expireDate)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Grid>)

    return (<Grid container spacing={2}>
        {viewExchange && viewExchange.cartA.length > 0 ? details(viewExchange.cartA, pharmacyNameA, '#3f51b5') : <Grid item xs={6} md={6} style={{ textAlign: 'center' }}><span>هیچ رکوردی برای داروخانه {<span style={{ color: '#3f51b5', fontWeight: 'bold' }}>{pharmacyNameA}</span>} وجود ندارد</span></Grid>}
        {viewExchange && viewExchange.cartB.length > 0 ? details(viewExchange.cartB, pharmacyNameB, '#c50000') : <Grid item xs={6} md={6} style={{ textAlign: 'center' }}><span>هیچ رکوردی برای داروخانه {<span style={{ color: '#c50000', fontWeight: 'bold' }}>{pharmacyNameB}</span>} وجود ندارد</span></Grid>}
    </Grid>)
}

export default DetailExchange;