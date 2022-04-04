import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';

import {
  StandardInput,
  InputSizeEnum,
  InputStateEnum,
  InputVariantEnum,
  Divider,
  ModalFormContainerStyle,
  FormContainerStyle,
  BodyContainer,
  Body,
  DescriptionIcon,
  ToolTipContainer,
  DateSelect,
  LabelContainer,
  InputContainer,
  StyledFieldContainer,
  StyledLabelContainer,
  DateVariantEnum,
  SpanTwoColumnsContainer,
  HrSpanTwoColumnsContainer,
  SimpleSelectVariantEnum,
  SimpleSelectSizeEnum,
  SimpleSelectStateEnum,
  SimpleSelectTypeEnum,
  SimpleSelect,
} from '..';

import { labelSchema } from '../../store/validations';
import { setValidationErrors } from '../../utils/validationUtils';

const CreateProjectLabelsForm = ({ value, onChange }) => {
  const { validateForm, formType } = useSelector(state => state.app);
  const [errorLabelMessage, setErrorLabelMessage] = useState({});
  const intl = useIntl();
  const { pickLists } = useSelector(store => store.climateWarehouse);

  const areFieldsDisabled = Boolean(value.id);

  useEffect(() => {
    if (validateForm && formType === 'labels') {
      setValidationErrors(labelSchema, value, setErrorLabelMessage);
    }
  }, [value, validateForm, formType]);

  return (
    <ModalFormContainerStyle>
      <FormContainerStyle>
        <BodyContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="label" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-label-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <StandardInput
                variant={errorLabelMessage?.label && InputVariantEnum.error}
                size={InputSizeEnum.large}
                placeholderText={intl.formatMessage({
                  id: 'label',
                })}
                state={
                  areFieldsDisabled
                    ? InputStateEnum.disabled
                    : InputStateEnum.default
                }
                value={value.label}
                onChange={event => {
                  onChange({ ...value, label: event });
                }}
              />
            </InputContainer>
            {errorLabelMessage?.label && (
              <Body size="Small" color="red">
                {errorLabelMessage.label}
              </Body>
            )}
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="label-type" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-label-type-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <SimpleSelect
                variant={
                  errorLabelMessage?.labelType && SimpleSelectVariantEnum.error
                }
                size={SimpleSelectSizeEnum.large}
                type={SimpleSelectTypeEnum.basic}
                options={pickLists.labelType}
                state={
                  areFieldsDisabled
                    ? SimpleSelectStateEnum.disabled
                    : SimpleSelectStateEnum.default
                }
                selected={value.labelType ? [value.labelType] : undefined}
                onChange={selectedOptions =>
                  onChange({ ...value, labelType: selectedOptions[0] })
                }
              />
            </InputContainer>
            {errorLabelMessage?.labelType && (
              <Body size="Small" color="red">
                {errorLabelMessage.labelType}
              </Body>
            )}
          </StyledFieldContainer>
          <SpanTwoColumnsContainer>
            <StyledFieldContainer>
              <StyledLabelContainer>
                <Body>
                  <LabelContainer>
                    *<FormattedMessage id="label-link" />
                  </LabelContainer>
                  <ToolTipContainer
                    tooltip={intl.formatMessage({
                      id: 'labels-label-link-description',
                    })}
                  >
                    <DescriptionIcon height="14" width="14" />
                  </ToolTipContainer>
                </Body>
              </StyledLabelContainer>
              <StandardInput
                variant={errorLabelMessage.labelLink && InputVariantEnum.error}
                size={InputSizeEnum.large}
                placeholderText={intl.formatMessage({
                  id: 'label-link',
                })}
                state={
                  areFieldsDisabled
                    ? InputStateEnum.disabled
                    : InputStateEnum.default
                }
                value={value.labelLink}
                onChange={event => {
                  onChange({ ...value, labelLink: event });
                }}
              />
              {errorLabelMessage?.labelLink && (
                <Body size="Small" color="red">
                  {errorLabelMessage.labelLink}
                </Body>
              )}
            </StyledFieldContainer>
          </SpanTwoColumnsContainer>
          <HrSpanTwoColumnsContainer>
            <hr />
          </HrSpanTwoColumnsContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="validity-period-start-date" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-validity-period-start-date-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <DateSelect
                variant={
                  errorLabelMessage?.validityPeriodStartDate &&
                  DateVariantEnum.error
                }
                size="large"
                dateValue={value.validityPeriodStartDate}
                setDateValue={event =>
                  onChange({ ...value, validityPeriodStartDate: event })
                }
                disabled={areFieldsDisabled ? true : undefined}
              />
            </InputContainer>
            {errorLabelMessage?.validityPeriodStartDate && (
              <Body size="Small" color="red">
                {errorLabelMessage.validityPeriodStartDate}
              </Body>
            )}
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="validity-period-end-date" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-validity-period-end-date-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <DateSelect
                variant={
                  errorLabelMessage?.validityPeriodEndDate &&
                  DateVariantEnum.error
                }
                size="large"
                dateValue={value.validityPeriodEndDate}
                setDateValue={event =>
                  onChange({ ...value, validityPeriodEndDate: event })
                }
                disabled={areFieldsDisabled ? true : undefined}
              />
            </InputContainer>
            {errorLabelMessage?.validityPeriodEndDate && (
              <Body size="Small" color="red">
                {errorLabelMessage.validityPeriodEndDate}
              </Body>
            )}
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="crediting-period-start-date" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-crediting-period-start-date-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <DateSelect
                variant={
                  errorLabelMessage?.creditingPeriodStartDate &&
                  DateVariantEnum.error
                }
                size="large"
                dateValue={value.creditingPeriodStartDate}
                setDateValue={event =>
                  onChange({ ...value, creditingPeriodStartDate: event })
                }
                disabled={areFieldsDisabled ? true : undefined}
              />
            </InputContainer>
            {errorLabelMessage?.creditingPeriodStartDate && (
              <Body size="Small" color="red">
                {errorLabelMessage.creditingPeriodStartDate}
              </Body>
            )}
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="crediting-period-end-date" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-crediting-period-end-date-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <DateSelect
                variant={
                  errorLabelMessage?.creditingPeriodEndDate &&
                  DateVariantEnum.error
                }
                size="large"
                dateValue={value.creditingPeriodEndDate}
                setDateValue={event =>
                  onChange({ ...value, creditingPeriodEndDate: event })
                }
                disabled={areFieldsDisabled ? true : undefined}
              />
            </InputContainer>
            {errorLabelMessage?.creditingPeriodEndDate && (
              <Body size="Small" color="red">
                {errorLabelMessage.creditingPeriodEndDate}
              </Body>
            )}
          </StyledFieldContainer>
          <HrSpanTwoColumnsContainer>
            <hr />
          </HrSpanTwoColumnsContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="unit-quantity" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-unit-quantity-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <StandardInput
                variant={
                  errorLabelMessage.unitQuantity && InputVariantEnum.error
                }
                type="number"
                size={InputSizeEnum.large}
                placeholderText={intl.formatMessage({
                  id: 'unit-quantity',
                })}
                state={
                  areFieldsDisabled
                    ? InputStateEnum.disabled
                    : InputStateEnum.default
                }
                value={value.unitQuantity}
                onChange={event => {
                  onChange({ ...value, unitQuantity: event });
                }}
              />
            </InputContainer>
            {errorLabelMessage?.unitQuantity && (
              <Body size="Small" color="red">
                {errorLabelMessage.unitQuantity}
              </Body>
            )}
          </StyledFieldContainer>
        </BodyContainer>
      </FormContainerStyle>
      <Divider />
    </ModalFormContainerStyle>
  );
};

export { CreateProjectLabelsForm };
