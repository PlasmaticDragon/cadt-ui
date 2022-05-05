import * as yup from 'yup';
import { labelSchema, issuanceSchema } from '.';

export const unitsSchema = yup.object().shape({
  projectLocationId: yup.string().optional(),
  unitOwner: yup.string().required('Required Field'),
  countryJurisdictionOfOwner: yup.string().required('Required Field'),
  inCountryJurisdictionOfOwner: yup.string().optional(),
  serialNumberBlock: yup.string().required('Required Field'),
  unitBlockEnd: yup.string().required('Required Field'),
  unitBlockStart: yup.string().required('Required Field'),
  unitCount: yup.number().required('Required Field'),
  vintageYear: yup
    .number()
    .typeError('Invalid Year')
    .integer()
    .min(1900)
    .max(3000)
    .required('Required Field'),
  unitType: yup.string().required('Required Field'),
  marketplace: yup.string().optional(),
  marketplaceLink: yup.string().optional(),
  marketplaceIdentifier: yup.string().optional(),
  unitTags: yup.string().optional(),
  unitStatus: yup.string().required('Required Field'),
  unitStatusReason: yup.string().when('unitStatus', {
    is: val => ['cancelled', 'retired'].includes(val.toLowerCase()),
    then: yup.string().required('Required Field'),
    otherwise: yup.string().optional(),
  }),
  unitRegistryLink: yup.string().required('Required Field'),
  correspondingAdjustmentDeclaration: yup.string().required('Required Field'),
  correspondingAdjustmentStatus: yup.string().required('Required Field'),
  issuance: issuanceSchema,
  labels: yup.array().of(labelSchema).optional(),
});
