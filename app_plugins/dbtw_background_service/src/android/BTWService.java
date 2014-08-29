package com.tsubik.cordova.dbtw_background_service;

import android.app.AlarmManager;
import android.app.NotificationManager;
import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;

import android.webkit.WebBackForwardList;
import android.webkit.WebHistoryItem;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebSettings.LayoutAlgorithm;

import android.location.Location;
import android.location.Criteria;
import android.location.LocationListener;
import android.location.LocationManager;
import android.widget.Toast;

import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;

class MyJavaScriptInterface {
	public static Context applicationContext;

	public void someCallback(final String jsResult) {
		Handler h = new Handler();

		h.post(new Runnable() {
			@Override
			public void run() {
				Toast.makeText(MyJavaScriptInterface.applicationContext,jsResult,Toast.LENGTH_LONG).show();
			}
		});
	}
}

public class BTWService extends Service {

	protected LocationManager locationManager;

	@Override
	public void onCreate() {
		WebView webView = new WebView(this);
		webView.getSettings().setJavaScriptEnabled(true);
		webView.getSettings().setDomStorageEnabled(true);
		MyJavaScriptInterface javaInterface = new MyJavaScriptInterface();
		MyJavaScriptInterface.applicationContext = getApplicationContext();
		webView.addJavascriptInterface(javaInterface, "HTMLOUT");
		webView.loadUrl("javascript:( function () { var name = window.localStorage['donebytheway-tasks']; window.HTMLOUT.someCallback(name); } ) ()");
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
	    //TODO do something useful
		return Service.START_NOT_STICKY;
	}

	@Override
	public IBinder onBind(Intent intent) {
	  //TODO for communication return IBinder implementation
		return null;
	}

	@Override
	public void onDestroy() {
		Toast.makeText(this, "service done", Toast.LENGTH_SHORT).show();
	}
}