package com.tenforwardconsulting.cordova.bgloc;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;
import android.util.Log;

public class BTWPlugin extends CordovaPlugin {
    private static final String TAG = "BTWPlugin";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        Log.d(pluginName, "LocalStoragePlugin execute action: "+ action + " args: " + args.toString());
        JSONObject o;

        if(action.equalsIgnoreCase("getItem")){
            o = args.getJSONObject(0);
            callbackContext.success(this.localStorage.getItem(o.getString("key")));    
        }
        else if(action.equalsIgnoreCase("setItem")){ 
            o = args.getJSONObject(0);
            this.localStorage.setItem(o.getString("key"), o.getString("value"));    
        }
        else if(action.equalsIgnoreCase("removeItem")){ 
            o = args.getJSONObject(0);
            this.localStorage.removeItem(o.getString("key"));
        }
        else if(action.equalsIgnoreCase("clear")){ 
            this.localStorage.clear();
        }
        else{ 
            return false;
        }
        return true;

    }

}
