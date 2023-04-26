
package cn.flashtalk.hatom;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import cn.flashtalk.hatom.Test;

import java.util.Map;

public class RNHatomVideoModule extends ReactContextBaseJavaModule {
  private static final String TAG = "RNHatomVideoModule";

  private final ReactApplicationContext reactContext;

  private Test test = new Test();

  public RNHatomVideoModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    test.test = "RNHatomVideoModule";
  }

  @Override
  public String getName() {
    return "RNHatomVideo";
  }

   @ReactMethod
   public void setDataSource(String path) {
     Log.i(TAG, "setDataSource: " + path);
   }
  
   @ReactMethod
   public void initTest(String testStr, Callback callback) {
      Log.i(TAG, "Original test: " + test.test);
     Log.i(TAG, "initTest: " + testStr);
     test.test = testStr;
     Log.i(TAG, "initTest: invoke");
     callback.invoke(test.test);
   }
  
   @ReactMethod
   public void changeTest(String testStr) {
       Log.i(TAG, "Original test: " + test.test);
     Log.i(TAG, "changeTest: Test" + testStr);
     test.test = testStr;
   }
}