import { Grid } from '@material-ui/core';
import React, { useState, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryCache } from 'react-query';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import { 
    ActionInterface, MembershipRequestInterface, TableColumnInterface
} from '../../../../interfaces';
import { MembershipRequest } from '../../../../services/api';
import { errorHandler, successSweetAlert, warningSweetAlert } from '../../../../utils';
import { useClasses } from '../classes';
import Modal from '../../../public/modal/Modal';
import DataTable from '../../../public/datatable/DataTable';
import CircleLoading from '../../../public/loading/CircleLoading';
import { MembershipRequestEnum } from '../../../../enum/query';

const initialState: MembershipRequestInterface = {
    id: 0,
    userID: 0,
    pharmacyID: 0,
    sendDate: '',
    accepted: false,
    pharmacyComment: '',
}


function reducer(state = initialState, action: ActionInterface): any {
    const { value } = action;

    switch (action.type) {
        case 'id':
            return {
                ...state,
                id: value,
            };
        case 'userID':
            return {
                ...state,
                userID: value,
            };
        case 'pharmacyID':
            return {
                ...state,
                pharmacyID: value,
            };
        case 'sendDate':
            return {
                ...state,
                sendDate: value,
            };
        case 'accepted':
            return {
                ...state,
                accepted: value,
            };
        case 'pharmacyComment':
            return {
                ...state,
                pharmacyComment: value,
            };
        case 'reset':
            return initialState;
        default:
            console.error('Action type not defined')
            break;
    }
}

const Membership: React.FC = () => {
    const ref = useDataTableRef();
    const { t } = useTranslation();
    const queryCache = useQueryCache();
    
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isOpenSaveModal, setIsOpenSaveModal] = useState(false);
    const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal(v => !v);

    const {
        container, root, formContainer, box, addButton, cancelButton, dropdown
    } = useClasses();

    const tableColumns = (): TableColumnInterface[] => {
        return [
            { field: 'id', title: t('general.id'), type: 'number',
                cellStyle: { textAlign: 'right' } },
            { field: 'user.name', title: t('user.name'), type: 'string' },
            { field: 'user.family', title: t('user.family'), type: 'string' },
            { field: 'sendDate', title: t('user.sendDate'), type: 'string' },
            { field: 'accepted', title: t('user.accepted'), type: 'boolean' },
        ];
    };

    const {
        all, accept
    } = new MembershipRequest();

    const [_accept, { isLoading }] = useMutation(accept, {
        onSuccess: async () => {
            await queryCache.invalidateQueries('membershipRequestsList');
            await successSweetAlert(t('alert.successfulSave'));
            dispatch({ type: 'reset' });
        }
    });

    const acceptHandler = async (item: MembershipRequestInterface): Promise<any> => {
        toggleIsOpenSaveModalForm();

        const {
            id, pharmacyID, accepted, pharmacyComment
        } = item;
        dispatch({ type: 'id', value: id });
        dispatch({ type: 'pharmacyID', value: pharmacyID });
        dispatch({ type: 'accepted', value: accepted });
        dispatch({ type: 'pharmacyComment', value: pharmacyComment });
    };

    const isFormValid = (): boolean => {
        return (
            state.pharmacyComment && state.pharmacyComment.trim().length > 0
        );
    };

    const submitAccept = async( el: React.FormEvent<HTMLFormElement>): Promise<any> => {
        el.preventDefault();

        const {
            id, pharmacyID, accepted, pharmacyComment
        } = state;
        
        if (isFormValid()) {
            try {
                await _accept({ id, accepted, pharmacyComment });
                dispatch({ type: 'reset' });
                ref.current?.loadItems();
            } catch (e) {
                errorHandler(e);
            }
        } else {
            await warningSweetAlert(t('alert.fillFormCarefully'));
        }
    }

    const editModal = (): JSX.Element => {
        return (
            <Modal open={isOpenSaveModal} toggle={toggleIsOpenSaveModalForm}>
                <h1>Modal</h1>
            </Modal>
        )
    }

    return (
        <>
            <Grid container>
                <div>{t('user.membershipRequestsList')}</div>
                <DataTable
                    ref={ref}
                    columns={tableColumns()}
                    stateAction={
                        async (e: any, row: any): Promise<void> => await acceptHandler(row) }
                    queryKey={MembershipRequestEnum.GET_ALL}
                    queryCallback={all}
                    initLoad={false}
                />
                { isLoading && <CircleLoading /> }
                { isOpenSaveModal && editModal() }
            </Grid>
        </>
    );
};

export default Membership;
