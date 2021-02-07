import { Grid, makeStyles } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { ViewExchangeInterface } from '../../../../interfaces/ViewExchangeInterface';
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
    const { exchangeId, pharmacyNameA, pharmacyNameB } = props;
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

    return (<Grid container spacing={2}>
        <Grid item xs={6} md={6}>
            <table className={table}>
                <thead>
                    <tr style={{ textAlign: 'center', color: '#3f51b5' }}>
                        <th colSpan={4}>{pharmacyNameA}</th>
                    </tr>
                    <tr>
                        <th style={{ width: 35 }}>ردیف</th>
                        <th style={{ width: 400 }}>نام دارو</th>
                        <th style={{ width: 100 }}>قیمت</th>
                        <th style={{ width: 150 }}>تاریخ انقضا</th>
                    </tr>
                </thead>
                <tbody>
                    {viewExchange?.cartB.map((item, index) => (
                        <tr>
                            <td>{++index}</td>
                            <td>{item.drug.name}({item.drug.genericName})</td>
                            <td>{Utils.numberWithCommas(item.amount)}</td>
                            <td>{Utils.getExpireDate(item.expireDate)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Grid>
        <Grid item xs={6} md={6}>
            <table className={table}>
                <thead>
                    <tr style={{ textAlign: 'center', color: '#c50000' }}>
                        <th colSpan={4}>{pharmacyNameB}</th>
                    </tr>
                    <tr>
                        <th style={{ width: 35 }}>ردیف</th>
                        <th style={{ width: 400 }}>نام دارو</th>
                        <th style={{ width: 100 }}>قیمت</th>
                        <th style={{ width: 150 }}>تاریخ انقضا</th>
                    </tr>
                </thead>
                <tbody>
                    {viewExchange?.cartA.map((item, index) => (
                        <tr>
                            <td>{++index}</td>
                            <td>{item.drug.name}({item.drug.genericName})</td>
                            <td>{Utils.numberWithCommas(item.amount)}</td>
                            <td>{Utils.getExpireDate(item.expireDate)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Grid>
    </Grid>)
}

export default DetailExchange;