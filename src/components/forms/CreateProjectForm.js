import _ from 'lodash';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Stepper, Step, StepLabel } from '@mui/material';

import {
  StandardInput,
  InputSizeEnum,
  InputStateEnum,
  TabPanel,
  Modal,
  Body,
  ModalFormContainerStyle,
  FormContainerStyle,
  BodyContainer,
  DateSelect,
  Message,
  ToolTipContainer,
  DescriptionIcon,
  modalTypeEnum,
  StyledFieldRequired,
  FieldRequired,
  StyledLabelContainer,
  StyledFieldContainer,
  InputContainer,
  LabelContainer,
  Select,
  SelectSizeEnum,
  SelectTypeEnum,
  SelectStateEnum,
} from '..';
import LabelsRepeater from './LabelsRepeater';
import IssuanceRepeater from './IssuanceRepeater';
import CoBenefitsRepeater from './CoBenefitsRepeater';
import LocationsRepeater from './LocationsRepeater';
import RelatedProjectsRepeater from './RelatedProjectsRepeater';
import { postNewProject } from '../../store/actions/climateWarehouseActions';
import { FormattedMessage, useIntl } from 'react-intl';

const StyledFormContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
`;

const CreateProjectForm = withRouter(
  ({ onClose, left, top, width, height }) => {
    const [newLabels, setNewLabels] = useState([]);
    const [newRelatedProjects, setNewRelatedProjects] = useState([]);
    const [newIssuance, setNewIssuance] = useState([]);
    const [date, setDate] = useState();
    const [validationDate, setValidationDate] = useState();
    const [newProjectLocations, setNewProjectLocations] = useState([]);
    const [newCoBenefits, setNewCoBenefits] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const dispatch = useDispatch();
    const intl = useIntl();
    const { notification } = useSelector(state => state.app);
    const { pickLists } = useSelector(store => store.climateWarehouse);
    const labelRef = useRef();
    const issuanceRef = useRef();

    const [newProject, setNewProject] = useState({
      registryOfOrigin: '',
      originProjectId: '',
      program: '',
      projectId: '',
      projectName: '',
      projectLink: '',
      projectDeveloper: '',
      sector: '',
      projectType: '',
      coveredByNDC: 0,
      NDCLinkage: '',
      projectStatus: '',
      unitMetric: '',
      methodology: '',
      methodologyVersion: 0,
      validationApproach: '',
      estimatedAnnualAverageEmissionReduction: 60,
      projectTag: '',
    });

    const selectCoveredByNDCOptions = useMemo(
      () =>
        pickLists.coveredByNDC.map(coveredByNDCItem => ({
          value: coveredByNDCItem,
          label: coveredByNDCItem,
        })),
      [pickLists],
    );

    const selectProjectTypeOptions = useMemo(
      () =>
        pickLists.projectType.map(projectTypeItem => ({
          value: projectTypeItem,
          label: projectTypeItem,
        })),
      [pickLists],
    );

    const selectMethodologyOptions = useMemo(
      () =>
        pickLists.methodology.map(methodologyItem => ({
          value: methodologyItem,
          label: methodologyItem,
        })),
      [pickLists],
    );

    const selectProjectSectorOptions = useMemo(
      () =>
        pickLists.projectSector.map(projectSectorItem => ({
          value: projectSectorItem,
          label: projectSectorItem,
        })),
      [pickLists],
    );

    const selectProjectStatusValuesOptions = useMemo(
      () =>
        pickLists.projectStatusValues.map(projectStatusValuesItem => ({
          value: projectStatusValuesItem,
          label: projectStatusValuesItem,
        })),
      [pickLists],
    );

    const selectRegistriesOptions = useMemo(
      () =>
        pickLists.registries.map(registriesItem => ({
          value: registriesItem,
          label: registriesItem,
        })),
      [pickLists],
    );

    const handleSubmit = () => {
      if (tabValue === 5) {
        const dataToSend = _.cloneDeep(newProject);

        if (!_.isEmpty(newIssuance)) {
          dataToSend.issuance = newIssuance;
        }

        if (!_.isEmpty(newCoBenefits)) {
          dataToSend.coBenefits = newCoBenefits;
        }

        if (!_.isEmpty(newLabels)) {
          dataToSend.labels = newLabels;
        }

        if (!_.isEmpty(date)) {
          dataToSend.projectStatusDate = `${date.$M + 1}/${date.$D}/${date.$y}`;
        }

        if (!_.isEmpty(validationDate)) {
          dataToSend.validationDate = `${validationDate.$M + 1}/${
            validationDate.$D
          }/${validationDate.$y}`;
        }

        if (!_.isEmpty(newProjectLocations)) {
          dataToSend.projectLocations = newProjectLocations;
        }

        if (!_.isEmpty(newRelatedProjects)) {
          dataToSend.relatedProjects = newRelatedProjects;
        }

        dispatch(postNewProject(dataToSend));
      } else {
        setTabValue(prev => prev + 1);
      }
    };

    const projectWasSuccessfullyCreated =
      notification?.id === 'project-successfully-created';
    useEffect(() => {
      if (projectWasSuccessfullyCreated) {
        onClose();
      }
    }, [notification]);

    const stepperStepsTranslationIds = [
      'project',
      'labels',
      'issuances',
      'co-benefits',
      'project-locations',
      'related-projects',
    ];

    return (
      <>
        {notification && !projectWasSuccessfullyCreated && (
          <Message id={notification.id} type={notification.type} />
        )}
        <Modal
          left={left}
          top={top}
          width={width}
          height={height}
          onOk={handleSubmit}
          onClose={onClose}
          modalType={modalTypeEnum.basic}
          title={intl.formatMessage({
            id: 'create-project',
          })}
          label={intl.formatMessage({
            id: tabValue < 5 ? 'next' : 'create',
          })}
          extraButtonLabel={tabValue > 0 ? 'Back' : undefined}
          extraButtonOnClick={() =>
            setTabValue(prev => (prev > 0 ? prev - 1 : prev))
          }
          body={
            <StyledFormContainer>
              <Stepper activeStep={tabValue} alternativeLabel>
                {stepperStepsTranslationIds &&
                  stepperStepsTranslationIds.map((stepTranslationId, index) => (
                    <Step
                      key={index}
                      onClick={() => setTabValue(index)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <StepLabel>
                        {intl.formatMessage({
                          id: stepTranslationId,
                        })}
                      </StepLabel>
                    </Step>
                  ))}
              </Stepper>
              <div>
                <TabPanel
                  style={{ paddingTop: '1.25rem' }}
                  value={tabValue}
                  index={0}
                >
                  <ModalFormContainerStyle>
                    <FormContainerStyle>
                      <BodyContainer>
                        <FieldRequired />
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="registry-of-origin" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-registry-of-origin-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <Select
                              size={SelectSizeEnum.large}
                              type={SelectTypeEnum.basic}
                              options={selectRegistriesOptions}
                              state={SelectStateEnum.default}
                              selected={
                                newProject.registryOfOrigin
                                  ? [
                                      {
                                        label: newProject.registryOfOrigin,
                                        value: newProject.registryOfOrigin,
                                      },
                                    ]
                                  : undefined
                              }
                              onChange={selectedOptions =>
                                setNewProject(prev => ({
                                  ...prev,
                                  registryOfOrigin: selectedOptions[0].value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="origin-project-id" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-origin-project-id-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <StandardInput
                              size={InputSizeEnum.large}
                              placeholderText={intl.formatMessage({
                                id: 'origin-project-id',
                              })}
                              state={InputStateEnum.default}
                              value={newProject.originProjectId}
                              onChange={value =>
                                setNewProject(prev => ({
                                  ...prev,
                                  originProjectId: value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="program" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-program-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <StandardInput
                              size={InputSizeEnum.large}
                              placeholderText={intl.formatMessage({
                                id: 'program',
                              })}
                              state={InputStateEnum.default}
                              value={newProject.program}
                              onChange={value =>
                                setNewProject(prev => ({
                                  ...prev,
                                  program: value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="project-id" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-project-id-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'project-id',
                            })}
                            state={InputStateEnum.default}
                            value={newProject.projectId}
                            onChange={value =>
                              setNewProject(prev => ({
                                ...prev,
                                projectId: value,
                              }))
                            }
                          />
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="project-name" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-project-name-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <StandardInput
                              size={InputSizeEnum.large}
                              placeholderText={intl.formatMessage({
                                id: 'project-name',
                              })}
                              state={InputStateEnum.default}
                              value={newProject.projectName}
                              onChange={value =>
                                setNewProject(prev => ({
                                  ...prev,
                                  projectName: value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="project-link" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-project-link-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <StandardInput
                              size={InputSizeEnum.large}
                              placeholderText={intl.formatMessage({
                                id: 'project-link',
                              })}
                              state={InputStateEnum.default}
                              value={newProject.projectLink}
                              onChange={value =>
                                setNewProject(prev => ({
                                  ...prev,
                                  projectLink: value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="project-developer" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-project-developer-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <StandardInput
                              size={InputSizeEnum.large}
                              placeholderText={intl.formatMessage({
                                id: 'project-developer',
                              })}
                              state={InputStateEnum.default}
                              value={newProject.projectDeveloper}
                              onChange={value =>
                                setNewProject(prev => ({
                                  ...prev,
                                  projectDeveloper: value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="sector" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-sector-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <Select
                              size={SelectSizeEnum.large}
                              type={SelectTypeEnum.basic}
                              options={selectProjectSectorOptions}
                              state={SelectStateEnum.default}
                              selected={
                                newProject.sector
                                  ? [
                                      {
                                        label: newProject.sector,
                                        value: newProject.sector,
                                      },
                                    ]
                                  : undefined
                              }
                              onChange={selectedOptions =>
                                setNewProject(prev => ({
                                  ...prev,
                                  sector: selectedOptions[0].value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="project-type" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-project-type-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <Select
                            size={SelectSizeEnum.large}
                            type={SelectTypeEnum.basic}
                            options={selectProjectTypeOptions}
                            state={SelectStateEnum.default}
                            selected={
                              newProject.projectType
                                ? [
                                    {
                                      label: newProject.projectType,
                                      value: newProject.projectType,
                                    },
                                  ]
                                : undefined
                            }
                            onChange={selectedOptions =>
                              setNewProject(prev => ({
                                ...prev,
                                projectType: selectedOptions[0].value,
                              }))
                            }
                          />
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="covered-by-ndc" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-covered-by-ndc-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <Select
                              size={SelectSizeEnum.large}
                              type={SelectTypeEnum.basic}
                              options={selectCoveredByNDCOptions}
                              state={SelectStateEnum.default}
                              selected={
                                newProject.coveredByNDC
                                  ? [
                                      {
                                        label: newProject.coveredByNDC,
                                        value: newProject.coveredByNDC,
                                      },
                                    ]
                                  : undefined
                              }
                              onChange={selectedOptions =>
                                setNewProject(prev => ({
                                  ...prev,
                                  coveredByNDC: selectedOptions[0].value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                      </BodyContainer>
                      <BodyContainer>
                        <StyledFieldRequired />
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="ndc-linkage" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-ndc-linkage-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <StandardInput
                              size={InputSizeEnum.large}
                              placeholderText={intl.formatMessage({
                                id: 'ndc-linkage',
                              })}
                              state={InputStateEnum.default}
                              value={newProject.NDCLinkage}
                              onChange={value =>
                                setNewProject(prev => ({
                                  ...prev,
                                  NDCLinkage: value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="project-status" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-project-status-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <Select
                              size={SelectSizeEnum.large}
                              type={SelectTypeEnum.basic}
                              options={selectProjectStatusValuesOptions}
                              state={SelectStateEnum.default}
                              selected={
                                newProject.projectStatus
                                  ? [
                                      {
                                        label: newProject.projectStatus,
                                        value: newProject.projectStatus,
                                      },
                                    ]
                                  : undefined
                              }
                              onChange={selectedOptions =>
                                setNewProject(prev => ({
                                  ...prev,
                                  projectStatus: selectedOptions[0].value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="project-status-date" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-project-status-date-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <DateSelect
                              size="large"
                              dateValue={date}
                              setDateValue={setDate}
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="unit-metric" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-unit-metric-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <StandardInput
                              size={InputSizeEnum.large}
                              placeholderText={intl.formatMessage({
                                id: 'unit-metric',
                              })}
                              state={InputStateEnum.default}
                              value={newProject.unitMetric}
                              onChange={value =>
                                setNewProject(prev => ({
                                  ...prev,
                                  unitMetric: value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="methodology" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-methodology-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <Select
                              size={SelectSizeEnum.large}
                              type={SelectTypeEnum.basic}
                              options={selectMethodologyOptions}
                              state={SelectStateEnum.default}
                              selected={
                                newProject.methodology
                                  ? [
                                      {
                                        label: newProject.methodology,
                                        value: newProject.methodology,
                                      },
                                    ]
                                  : undefined
                              }
                              onChange={selectedOptions =>
                                setNewProject(prev => ({
                                  ...prev,
                                  methodology: selectedOptions[0].value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="methodology-version" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-methodology-version-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <StandardInput
                              size={InputSizeEnum.large}
                              placeholderText={intl.formatMessage({
                                id: 'methodology-version',
                              })}
                              state={InputStateEnum.default}
                              value={newProject.methodologyVersion}
                              onChange={value =>
                                setNewProject(prev => ({
                                  ...prev,
                                  methodologyVersion: value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="validation-approach" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-validation-approach-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <StandardInput
                              size={InputSizeEnum.large}
                              placeholderText={intl.formatMessage({
                                id: 'validation-approach',
                              })}
                              state={InputStateEnum.default}
                              value={newProject.validationApproach}
                              onChange={value =>
                                setNewProject(prev => ({
                                  ...prev,
                                  validationApproach: value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="validation-date" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-validation-date-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <DateSelect
                              size="large"
                              dateValue={validationDate}
                              setDateValue={setValidationDate}
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="estimated-annual-average-emission-reduction" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-estimated-annual-average-emission-reduction-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <StandardInput
                              size={InputSizeEnum.large}
                              placeholderText={intl.formatMessage({
                                id: 'estimated-annual-average-emission-reduction',
                              })}
                              state={InputStateEnum.default}
                              value={
                                newProject.estimatedAnnualAverageEmissionReduction
                              }
                              onChange={value =>
                                setNewProject(prev => ({
                                  ...prev,
                                  estimatedAnnualAverageEmissionReduction:
                                    value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                          <StyledLabelContainer>
                            <Body>
                              <LabelContainer>
                                <FormattedMessage id="project-tags" />
                              </LabelContainer>
                              <ToolTipContainer
                                tooltip={intl.formatMessage({
                                  id: 'projects-project-tags-description',
                                })}
                              >
                                <DescriptionIcon height="14" width="14" />
                              </ToolTipContainer>
                            </Body>
                          </StyledLabelContainer>
                          <InputContainer>
                            <StandardInput
                              size={InputSizeEnum.large}
                              placeholderText={intl.formatMessage({
                                id: 'project-tags',
                              })}
                              state={InputStateEnum.default}
                              value={newProject.projectTag}
                              onChange={value =>
                                setNewProject(prev => ({
                                  ...prev,
                                  projectTag: value,
                                }))
                              }
                            />
                          </InputContainer>
                        </StyledFieldContainer>
                      </BodyContainer>
                    </FormContainerStyle>
                  </ModalFormContainerStyle>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <LabelsRepeater
                    labelsState={newLabels}
                    newLabelsState={setNewLabels}
                    labelRef={labelRef}
                  />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  <IssuanceRepeater
                    issuanceState={newIssuance}
                    newIssuanceState={setNewIssuance}
                    issuanceRef={issuanceRef}
                  />
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                  <CoBenefitsRepeater
                    coBenefitsState={newCoBenefits}
                    setNewCoBenefitsState={setNewCoBenefits}
                  />
                </TabPanel>
                <TabPanel value={tabValue} index={4}>
                  <LocationsRepeater
                    locationsState={newProjectLocations}
                    setLocationsState={setNewProjectLocations}
                  />
                </TabPanel>
                <TabPanel value={tabValue} index={5}>
                  <RelatedProjectsRepeater
                    relatedProjectsState={newRelatedProjects}
                    setRelatedProjectsState={setNewRelatedProjects}
                  />
                </TabPanel>
              </div>
            </StyledFormContainer>
          }
        />
      </>
    );
  },
);

export { CreateProjectForm };
