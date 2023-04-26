
package cn.flashtalk.hatom;

import android.util.Log;
import android.widget.TextView;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.annotations.ReactProp;

public class RNHatomVideoManager extends SimpleViewManager<TextView> {
    @Override
    public String getName() {
        return "RNHatomVideoView";
    }

    @Override
    protected TextView createViewInstance(ThemedReactContext reactContext) {
        TextView textView = new TextView(reactContext);
        textView.setBackgroundColor(android.graphics.Color.RED);
        textView.setText("176555");
        return textView;
    }

    @ReactProp(name = "test")
    public void setTest(TextView textView, String path) {
        Log.i("RNHatomVideoManager test: ", path);
    }
}