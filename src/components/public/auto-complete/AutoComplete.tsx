import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import style from './auto-complete.module.scss';
import { useTranslation } from 'react-i18next';
import { isUndefined, indexOf } from 'lodash';
import SelectedItems from './SelectedItems';
import styled from 'styled-components';

export interface ListOptions {
  label: string;
  value: string | number;
}

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  loadingText?: string;
  className?: string;
  options?: any[];
  isLoading?: boolean;
  onItemSelected: (e: ListOptions[]) => void;
  defaultSelectedItem?: string;
  multiple?: boolean;
  disable?: boolean;
}

const Li = styled.li`
  &:focus,
  &.focus {
    background-color: rgb(235, 235, 235);
    transition: background-color 0.2s ease;
  }
`;

const AutoComplete: React.FC<Props & { ref: Ref<any> }> = forwardRef(
  (
    {
      onChange,
      placeholder,
      className,
      loadingText,
      isLoading,
      options,
      onItemSelected,
      defaultSelectedItem,
      multiple,
      disable,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [showOptionsList, setShowOptionsList] = useState(false);
    const [valuesArray, setValuesArray] = useState<ListOptions[]>([]);
    const [liActiveIndex, setLiActiveIndex] = useState(0);
    const [prevOffsetTop, setPrevOffsetTop] = useState(0);

    useEffect(() => {
      const keyHandler = (e: KeyboardEvent): void => {
        const ulEl = (document.querySelectorAll('#ac-li-items li') as unknown) as HTMLElement[];
        const setClass = (index: number): void => ulEl[index].classList.add('focus');
        const removeClass = (index: number): void => ulEl[index].classList.remove('focus');

        if (showOptionsList) {
          switch (e.key) {
            case 'Escape':
              setShowOptionsList(false);
              break;
            case 'ArrowDown':
              removeClass(liActiveIndex);
              const index = liActiveIndex < ulEl.length - 1 ? liActiveIndex + 1 : ulEl.length - 1;
              setLiActiveIndex(index);
              setClass(index);
              break;
            case 'ArrowUp':
              removeClass(liActiveIndex);
              const _index = liActiveIndex > 0 ? liActiveIndex - 1 : 0;
              setLiActiveIndex(_index);
              setClass(_index);
              break;
            case 'Enter':
              ulEl[liActiveIndex].click();
              break;
          }
        }
      };

      document.addEventListener('keydown', keyHandler);
      return (): void => {
        document.removeEventListener('keydown', keyHandler);
      };
    }, [options, liActiveIndex, showOptionsList]);

    useEffect(() => {
      const focusedEl = (document.querySelector('.focus') as unknown) as HTMLElement;
      const optionsContainer = (document.getElementById('div-list') as unknown) as HTMLElement;
      if (focusedEl) {
        setPrevOffsetTop(focusedEl.offsetTop);
        if (
          prevOffsetTop < focusedEl.offsetTop &&
          focusedEl.offsetHeight + focusedEl.offsetTop > focusedEl!.offsetParent!.clientHeight
        ) {
          optionsContainer.scrollTop = focusedEl.offsetHeight + optionsContainer.scrollTop;
        } else if (prevOffsetTop > focusedEl.offsetTop) {
          optionsContainer.scrollTop = focusedEl.offsetTop - focusedEl.offsetHeight;
        }
      }
    }, [liActiveIndex]);

    useEffect(() => {
      const wrapperEl = document.getElementById('wrapper') as HTMLDivElement;
      const dropdownEl = (document.getElementById('div-list') as HTMLDivElement) ?? null;

      const handler = (e: MouseEvent): void => {
        const isClickInSideEl = wrapperEl.contains(e.target as any);
        if (dropdownEl !== null) {
          const isClickIsidedDropDown = dropdownEl?.contains(e.target as any);
          if (!isClickInSideEl && !isClickIsidedDropDown) {
            setShowOptionsList(false);
          }
        }
      };

      document.addEventListener('click', handler);

      return (): void => {
        document.removeEventListener('click', handler);
      };
    }, [showOptionsList]);

    useImperativeHandle(ref, () => ({
      setInputValue: setInputValue,
    }));

    const isInArray = (item: number): boolean => {
      return valuesArray.map((item) => item.value).indexOf(item) !== -1;
    };

    const optionItems = useCallback(() => {
      if (options) {
        return React.Children.toArray(
          options
            .filter((_item: any) => indexOf(valuesArray, _item.item) === -1)
            .map((option: any) => {
              return (
                <Li
                  value={option.item.value}
                  className={isInArray(option.item.value) ? style['active-item'] : ''}
                  onClick={(): void => {
                    if (multiple && indexOf(valuesArray, option.item) === -1) {
                      setValuesArray((v) => [...v, option.item]);
                      onItemSelected([...valuesArray, option.item]);
                      setInputValue('');
                    } else if (!multiple) {
                      onItemSelected([option.item]);
                      setInputValue(option.item.label);
                      setShowOptionsList(false);
                    }
                  }}
                >
                  {option.el}
                </Li>
              );
            })
        );
      }
    }, [options, valuesArray]);

    const { t } = useTranslation();

    const _onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const val = e.target.value;
      setInputValue(val);
      onChange(e);
    };

    const arrayItemRemoveHandler = (item: ListOptions): void => {
      const filteredItems = valuesArray.filter((_item) => _item.value !== item.value);
      setValuesArray([...filteredItems]);
      onItemSelected([...filteredItems]);
    };

    return (
      <div id="wrapper" className={style['wrapper']}>
        <div
          className={`${style['input-container']} ${
            options?.length === 0 || !showOptionsList ? style['itself-space'] : ''
          }`}
          onFocus={(): void => setShowOptionsList(true)}
        >
          <SelectedItems items={valuesArray} removeHandler={arrayItemRemoveHandler} />

          <input
            type="text"
            onChange={_onChange}
            placeholder={placeholder ?? ''}
            value={!!inputValue ? inputValue : defaultSelectedItem}
            className={`${style['input']} ${className ?? ''}`}
            disabled={disable ?? false}
          />
        </div>
        <div className={style['button-wrapper']}>
          {!disable && (
            <FontAwesomeIcon
              icon={showOptionsList ? faCaretUp : faCaretDown}
              className="cursor-pointer"
              onClick={(): void => {
                if (!showOptionsList) {
                  setShowOptionsList(true);
                } else {
                  setShowOptionsList(false);
                }
              }}
            />
          )}

          {(inputValue.length > 0 || valuesArray.length > 0) && (
            <FontAwesomeIcon
              icon={faTimes}
              className="cursor-pointer"
              onClick={(): void => {
                setValuesArray([]);
                setInputValue('');
                setShowOptionsList(false);
              }}
            />
          )}
        </div>

        {showOptionsList && (
          <div className={style['div-list']} id="div-list">
            {isLoading ? (
              <span className="text-muted">{loadingText}</span>
            ) : !isUndefined(options) && options.length > 0 ? (
              <ul id="ac-li-items">{optionItems()}</ul>
            ) : (
              <span>{t('general.noData')}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

AutoComplete.defaultProps = {
  defaultSelectedItem: '',
};

export default AutoComplete;
