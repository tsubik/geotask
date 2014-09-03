package com.tsubik.cordova.dbtw_background_service;
import android.content.Context;

import com.tsubik.cordova.plugin.asynclocalstorage.LocalStorage;

import org.json.*;

public class TaskService {
	protected LocalStorage localStorage;
	
	public TaskService(Context context){
		localStorage = new LocalStorage(context);
	}
	
	public JSONArray GetTasks(){
		String fromStorage = localStorage.getItem("donebytheway-tasks");
		try {
			if(fromStorage != null)
				return new JSONArray(fromStorage);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return new JSONArray();
	}
}
