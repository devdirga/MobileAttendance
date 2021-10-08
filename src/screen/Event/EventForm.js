import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';

import { connect } from 'react-redux';

import { Validator, Messaging, Helper } from '../../common';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import TextFieldWithoutInput from '../../components/TextField/TextFieldWithoutInput';
import SinglePicker from '../../components/SinglePicker';
import DatePicker from '../../components/DatePicker';

import { wrapperNoScroll } from '../../hoc';

import styles from './styles/event-form';
import { color } from '../../values';

import { eventInsert, eventUpdate, eventGetByID } from '../../store/action/event';

import { locationGetList } from '../../store/action/location';

import { userGetList } from '../../store/action/user';

import { entityGetMember } from '../../store/action/entity';

const EventForm = ({
  navigation,
  route,

  user,
  entity,
  location,

  entityGetMember,

  userGetList,
  eventInsert,
  eventUpdate,
  eventGetByID,
  locationGetList,
}) => {
  const [attendeesRandomKey, setAttendeesRandomKey] = useState(Math.random());
  const [randomKeyForm, setRandomKeyForm] = useState(Math.random());

  const [error, setError] = useState({
    name: null,
    attendees: null,
    startTime: null,
    endTime: null,
    location: null,
    description: null,
  });

  const [model, setModel] = useState({
    name: '',
    attendees: [],
    startTime: '',
    endTime: '',
    location: {},
    description: '',
  });

  useEffect(() => {
    methods.refresh();
    return () => { };
  }, []);

  const methods = {
    refresh: () => {
      console.log('event catch param', route.params)
      if (route.params.mode != 'new' && route.params.eventID) {
        eventGetByID(route.params.eventID, (res) => {
          console.log('response eventGetByID', res)
          if (res.success) {
            let temp = res.data;
            temp.attendees = temp.attendees.map((att) => {
              att.id = att.userID;
              if (!att.name) {
                att.name = att.email;
              }
              return att;
            });

            temp.location = {
              id: temp.locationID,
              name: temp.location.locationName,
            };

            setModel({
              ...temp,
            });

            setRandomKeyForm(Math.random());
          }
        });
      }
    },
    saveResponseHandler: (response) => {
      if (response.success) {
        Messaging.showMessage({
          message: 'Success',
          type: Messaging.types.SUCCESS,
        });
        if (typeof route.params.onSuccess == 'function') {
          route.params.onSuccess();
        }
        navigation.goBack();
      } else {
        Messaging.showMessage({
          message: response.message,
          type: Messaging.types.DANGER,
        });
      }
    },
    doSave: () => {
      let validationSuccess = true;
      let err = {};
      //#region validation
      if (!Validator.required(model.name)) {
        err.name = 'Name is required';
        validationSuccess = false;
      }
      if (!Validator.required(model.attendees)) {
        err.attendees = 'Attendees is required';
        validationSuccess = false;
      }
      if (!Validator.required(model.startTime)) {
        err.startTime = 'Start Date is required';
        validationSuccess = false;
      }
      if (!Validator.required(model.endTime)) {
        err.endTime = 'End Date is required';
        validationSuccess = false;
      }
      if (!Validator.required(model.location)) {
        err.location = 'Location is required';
        validationSuccess = false;
      }
      if (!Validator.required(model.description)) {
        err.description = 'Description is required';
        validationSuccess = false;
      }

      //#endregion

      if (!validationSuccess) {
        setError(err);
      } else {
        if (route.params.mode == 'new') {
          eventInsert(
            {
              entityID: user.selectedEntity ? user.selectedEntity.id || '' : '',
              locationID: model.location.id,
              name: model.name,
              description: model.description,
              startTime: model.startTime,
              endTime: model.endTime,
              attendees: model.attendees.map((x) => {
                if (x.id) {
                  return {
                    userID: x.id,
                    email: x.email,
                  };
                } else {
                  return {
                    email: x.email,
                  };
                }
              }),
            },
            methods.saveResponseHandler,
          );
        } else {
          eventUpdate(
            {
              id: model.id,
              entityID: user.selectedEntity ? user.selectedEntity.id || '' : '',
              locationID: model.location.id,
              name: model.name,
              description: model.description,
              startTime: model.startTime,
              endTime: model.endTime,
              attendees: model.attendees.map((x) => {
                if (x.id) {
                  return {
                    userID: x.id,
                    email: x.email,
                  };
                } else {
                  return {
                    email: x.email,
                  };
                }
              }),
            },
            methods.saveResponseHandler,
          );
        }
      }
    },
  };

  return (
    <View style={styles.mainWrapper}>
      <ScrollView
        key={randomKeyForm}
        style={styles.inputContainer}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              methods.refresh();
            }}
          />
        }>
        <TextField
          label="Name"
          error={error.name}
          value={model.name}
          onChangeText={(text) => {
            setError({ ...error, name: null });
            setModel({ ...model, name: text });
          }}
        />
        <SinglePicker
          key={attendeesRandomKey}
          label="Attendees"
          placeholder="type an email"
          textExtractor={(item) => {
            return item ? item.email : '';
          }}
          value={model.attendees}
          containerStyle={{}}
          emptyValue={[]}
          primaryId="email"
          captionField="email"
          fnAddNewData={(str) => {
            return { email: str, name: str };
          }}
          isMultiple={true}
          allowToAddNewData={true}
          onAddNewValidator={(item) => {
            if (Validator.email(item.email)) {
              return {
                success: true,
                message: '',
              };
            } else {
              return {
                success: false,
                message: 'Email is not valid',
              };
            }
          }}
          data={entity.members}
          serverPaging={true}
          onLoadData={(param, callBack) => {
            entityGetMember(
              {
                entityID: user.selectedEntity
                  ? user.selectedEntity.id || ''
                  : '',
                skip: param.skip,
                limit: param.limit,
                search: param.filter,
              },
              (response) => callBack(response.status ? response.data : []),
            );
            // userGetList({
            //   skip: param.skip,
            //   limit: param.limit,
            //   search: param.filter
            // }, (response) => callBack(response.status ? response.data : []));
          }}
          onSelect={(selected) => {
            setError({ ...error, attendees: null });
            setModel({ ...model, attendees: selected });
          }}
          renderChild={
            <>
              <TextFieldWithoutInput
                onDeleteItem={(item) => {
                  let temp = Helper.clone(model.attendees);
                  let selectedIDs = temp.map((x) => x.id);
                  let idxSelected = selectedIDs.indexOf(item.id);
                  if (idxSelected >= 0) {
                    temp.splice(idxSelected, 1);
                    setModel({ ...model, attendees: temp });
                    setAttendeesRandomKey(Math.random());
                  }
                }}
                error={error.attendees}
                value={model.attendees}
                primaryId="email"
                captionField="email"
                label="Attendees"
              />
            </>
          }
        />
        <DatePicker
          label="Start Date"
          mode="datetime"
          error={error.startTime}
          value={model.startTime}
          onSelect={(date) => {
            setError({ ...error, startTime: null });
            setModel({ ...model, startTime: date });
          }}
        />
        <DatePicker
          label="End Date"
          mode="datetime"
          error={error.endTime}
          value={model.endTime}
          onSelect={(date) => {
            setError({ ...error, endTime: null });
            setModel({ ...model, endTime: date });
          }}
        />
        <SinglePicker
          label="Location"
          textExtractor={(item) => {
            return item ? item.name : '';
          }}
          value={model.location}
          emptyValue={{}}
          data={location.list}
          serverPaging={true}
          onLoadData={(param, callBack) => {
            console.log('param onLoad location event...', param)
            locationGetList(
              {
                entityID: user.selectedEntity
                  ? user.selectedEntity.id || ''
                  : '',
                skip: param.skip,
                limit: param.limit,
                search: param.filter,
              },
              (response) => callBack(response.status ? response.data : []),
            );
          }}
          onSelect={(selected) => {
            setError({ ...error, location: null });
            setModel({ ...model, location: selected });
          }}
          renderChild={
            <>
              <TextFieldWithoutInput
                error={error.location}
                value={model.location.name || ''}
                label="Location"
              />
            </>
          }
        />
        <TextField
          label="Description"
          error={error.description}
          value={model.description}
          multiline={true}
          onChangeText={(text) => {
            setError({ ...error, description: null });
            setModel({ ...model, description: text });
          }}
        />

        <Button
          marginTop={14}
          text="Save"
          color={color.primary}
          textColor="white"
          size="lg"
          paddingVertical={12}
          borderRadius={4}
          onPress={() => methods.doSave()}
        />
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    entity: state.entity,
    location: state.location,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    eventInsert: (payload, callback) =>
      dispatch(eventInsert(payload, callback)),
    eventUpdate: (payload, callback) =>
      dispatch(eventUpdate(payload, callback)),
    eventGetByID: (id, callback) => dispatch(eventGetByID(id, callback)),
    locationGetList: (param, callback) =>
      dispatch(locationGetList(param, callback)),
    userGetList: (param, callback) => dispatch(userGetList(param, callback)),
    entityGetMember: (payload, callback) =>
      dispatch(entityGetMember(payload, callback)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(wrapperNoScroll(EventForm));
