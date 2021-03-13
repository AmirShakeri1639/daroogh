import { Chip } from '@material-ui/core';
import React, { useCallback } from 'react';
import { ListOptions } from './AutoComplete';
import styled from 'styled-components';

interface Props {
  items: ListOptions[];
  removeHandler: (item: ListOptions) => void;
}

const StyledChip = styled(Chip)`
  margin: 2px 0 2px 2px;
  height: fit-content;
  span {
    padding-top: 3px;
    padding-bottom: 3px;
    white-space: break-spaces !important;
  }
`;

const SelectedItems: React.FC<Props> = ({ items, removeHandler }) => {
  const listOfItems = useCallback(() => {
    return React.Children.toArray(
      items.map((item) => (
        <StyledChip
          label={item.label}
          color="default"
          onDelete={(): void => removeHandler(item)}
        />
      ))
    );
  }, [items]);

  return <>{listOfItems()}</>;
};

export default SelectedItems;
