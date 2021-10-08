import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import { WEB_URL } from 'react-native-dotenv';

const PurchaseLayout = ({ navigation, route }) => {
  const [url, setUrl] = useState(
    `${WEB_URL}subscription/pricing?token=${route.params.token}`,
  );
  const methods = {
    injectJS: () => {
      /**
       * CSS
          header.v-sheet.v-sheet--tile {
              display: none;
          }
          main.v-content {
              padding-top: 0px !important;
          }
          footer .v-card.v-card--flat {
              display: none;
          }
       */
      return `
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = 'header.v-sheet.v-sheet--tile { display: none; } main.v-content { padding-top: 0px !important; } footer .v-card.v-card--flat { display: none; }';
        document.head.appendChild(style);
      `;
    },
    onMessage: (str) => {
      let obj = JSON.parse(str);
      if (obj.success) {
        if (route.params.refreshMethod) {
          route.params.refreshMethod();
        }
        navigation.goBack();
      }
    },
  };
  return (
    <>
      {/*  */}

      <WebView
        source={{
          uri: `${WEB_URL}subscription/pricing?token=${route.params.token}`,
        }}
        injectedJavaScript={methods.injectJS()}
        onNavigationStateChange={(navState) => {
          // Keep track of going back navigation within component
        }}
        onMessage={(event) => {
          methods.onMessage(event.nativeEvent.data);
        }}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseLayout);
