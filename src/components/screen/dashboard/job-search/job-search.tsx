import React, { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryCache } from 'react-query';

const JobSearch: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            { t('jobSearch.jobSearch') }
        </>
    )
}

export default JobSearch;
