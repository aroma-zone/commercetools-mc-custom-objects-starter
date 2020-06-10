import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import * as yup from 'yup';
import Form from './form';
import messages from './messages';
import { TYPES } from './constants';

const ContainerForm = ({ onSubmit }) => {
  const intl = useIntl();

  const initialValues = {
    key: '',
    attributes: [
      {
        name: '',
        type: '',
        set: false,
        required: false
      }
    ]
  };

  const stringSchema = yup.string().required({
    required: intl.formatMessage(messages.requiredFieldError)
  });
  const attributeSchema = {
    name: stringSchema,
    type: stringSchema,
    set: yup.bool(),
    required: yup.bool(),
    reference: yup.string().when('type', {
      is: val => val === TYPES.Reference,
      then: stringSchema
    }),
    attributes: yup.array(yup.lazy(() => yup.object(attributeSchema)))
  };
  const validationSchema = yup.object({
    key: stringSchema,
    attributes: yup.array(yup.object(attributeSchema))
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => onSubmit(values)}
    >
      {props => <Form {...props} />}
    </Formik>
  );
};
ContainerForm.displayName = 'ContainerForm';
ContainerForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default ContainerForm;
