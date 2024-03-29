package cn.flashtalk.hatom.utils;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Log;

//import androidx.annotation.RequiresApi;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;

public class SaveUtils {
    private static final String TAG = "SaveUtils";

    // 低版本Android SDK 没有这些参数
    private static final int Build_VERSION_CODES_Q= 29;
    private static final String IS_PENDING = "is_pending";
    private static final String RELATIVE_PATH = "relative_path";

    /**
     * 将图片文件保存到系统相册
     */
    public static boolean saveImgFileToAlbum(Context context, String imageFilePath) {
        Log.i(TAG, "saveImgToAlbum() imageFile = [" + imageFilePath + "]");
        try {
            Bitmap bitmap = BitmapFactory.decodeFile(imageFilePath);
            return saveBitmapToAlbum(context, bitmap);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 将bitmap保存到系统相册
     */
    public static boolean saveBitmapToAlbum(Context context, Bitmap bitmap) {
        if (bitmap == null) return false;
        if (Build.VERSION.SDK_INT < Build_VERSION_CODES_Q) {
            return saveBitmapToAlbumBeforeQ(context, bitmap);
        } else {
            return saveBitmapToAlbumAfterQ(context, bitmap);
        }
    }

    //    @RequiresApi(api = Build_VERSION_CODES_Q)
    private static boolean saveBitmapToAlbumAfterQ(Context context, Bitmap bitmap) {
        Uri contentUri;
        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
            contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
        } else {
            contentUri = MediaStore.Images.Media.INTERNAL_CONTENT_URI;
        }
        ContentValues contentValues = getImageContentValues(context);
        Uri uri = context.getContentResolver().insert(contentUri, contentValues);
        if (uri == null) {
            return false;
        }
        OutputStream os = null;
        try {
            os = context.getContentResolver().openOutputStream(uri);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 50, os);
//            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//                Files.copy(bitmapFile.toPath(), os);
//            }
            contentValues.clear();
            contentValues.put(IS_PENDING, 0);
            context.getContentResolver().update(uri, contentValues, null, null);
            return true;
        } catch (Exception e) {
            context.getContentResolver().delete(uri, null, null);
            e.printStackTrace();
            return false;
        } finally {
            try {
                if (os != null) {
                    os.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private static boolean saveBitmapToAlbumBeforeQ(Context context, Bitmap bitmap) {
        File picDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM);
        File destFile = new File(picDir, context.getPackageName() + File.separator + System.currentTimeMillis() + ".jpg");
//            FileUtils.copy(imageFile, destFile.getAbsolutePath());
        OutputStream os = null;
        boolean result = false;
        try {
            if (!destFile.exists()) {
                destFile.getParentFile().mkdirs();
                destFile.createNewFile();
            }
            os = new BufferedOutputStream(new FileOutputStream(destFile));
            result = bitmap.compress(Bitmap.CompressFormat.JPEG, 50, os);
            if (!bitmap.isRecycled()) bitmap.recycle();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (os != null) {
                    os.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        MediaScannerConnection.scanFile(
                context,
                new String[]{destFile.getAbsolutePath()},
                new String[]{"image/*"},
                (path, uri) -> {
                    Log.i(TAG, "saveImgToAlbum: " + path + " " + uri);
                    // Scan Completed
                });
        return result;
    }

    /**
     * 获取图片的ContentValue
     *
     * @param context
     */
//    @RequiresApi(api = Build_VERSION_CODES_Q)
    public static ContentValues getImageContentValues(Context context) {
        ContentValues contentValues = new ContentValues();
        contentValues.put(MediaStore.Images.Media.DISPLAY_NAME, System.currentTimeMillis() + ".jpg");
        contentValues.put(MediaStore.Images.Media.MIME_TYPE, "image/*");
        contentValues.put(RELATIVE_PATH, Environment.DIRECTORY_DCIM + File.separator + context.getPackageName());
        contentValues.put(IS_PENDING, 1);
        contentValues.put(MediaStore.Images.Media.DATE_TAKEN, System.currentTimeMillis());
        contentValues.put(MediaStore.Images.Media.DATE_MODIFIED, System.currentTimeMillis());
        contentValues.put(MediaStore.Images.Media.DATE_ADDED, System.currentTimeMillis());
        return contentValues;
    }

    /**
     * 将视频保存到系统相册
     * TODO MS 23.6.6 高版本在系统相册生成无效文件，低版本无法倒入相册
     */
    public static boolean saveVideoToAlbum(Context context, String videoFile) {
        Log.i(TAG, "saveVideoToAlbum() videoFile = [" + videoFile + "]");
        if (Build.VERSION.SDK_INT < Build_VERSION_CODES_Q) {
            return saveVideoToAlbumBeforeQ(context, videoFile);
        } else {
            return saveVideoToAlbumAfterQ(context, videoFile);
        }


    }

    private static boolean saveVideoToAlbumAfterQ(Context context, String videoFile) {
        try {
            ContentResolver contentResolver = context.getContentResolver();
            File tempFile = new File(videoFile);
            ContentValues contentValues = getVideoContentValues(context, tempFile, System.currentTimeMillis());
            Uri uri = contentResolver.insert(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, contentValues);
            copyFileAfterQ(context, contentResolver, tempFile, uri);
            contentValues.clear();
            contentValues.put(IS_PENDING, 0);
            context.getContentResolver().update(uri, contentValues, null, null);
            context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, uri));
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private static boolean saveVideoToAlbumBeforeQ(Context context, String videoFile) {
        File picDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM);
        File tempFile = new File(videoFile);
        File destFile = new File(picDir, context.getPackageName() + File.separator + tempFile.getName());
        FileInputStream ins = null;
        BufferedOutputStream ous = null;
        try {
            ins = new FileInputStream(tempFile);
            ous = new BufferedOutputStream(new FileOutputStream(destFile));
            long nread = 0L;
            byte[] buf = new byte[1024];
            int n;
            while ((n = ins.read(buf)) > 0) {
                ous.write(buf, 0, n);
                nread += n;
            }
            MediaScannerConnection.scanFile(
                    context,
                    new String[]{destFile.getAbsolutePath()},
                    new String[]{"video/*"},
                    (path, uri) -> {
                        Log.i(TAG, "saveVideoToAlbum: " + path + " " + uri);
                        // Scan Completed
                    });
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            try {
                if (ins != null) {
                    ins.close();
                }
                if (ous != null) {
                    ous.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private static void copyFileAfterQ(Context context, ContentResolver localContentResolver, File tempFile, Uri localUri) throws IOException {
        if (Build.VERSION.SDK_INT >= Build_VERSION_CODES_Q &&
                context.getApplicationInfo().targetSdkVersion >= Build_VERSION_CODES_Q) {
            //拷贝文件到相册的uri,android10及以上得这么干，否则不会显示。可以参考ScreenMediaRecorder的save方法
            OutputStream os = localContentResolver.openOutputStream(localUri);
            Files.copy(tempFile.toPath(), os);
            os.close();
            tempFile.delete();
        }
    }


    /**
     * 获取视频的contentValue
     */
    public static ContentValues getVideoContentValues(Context context, File paramFile, long timestamp) {
        ContentValues localContentValues = new ContentValues();
        if (Build.VERSION.SDK_INT >= Build_VERSION_CODES_Q) {
            localContentValues.put(RELATIVE_PATH, Environment.DIRECTORY_DCIM
                    + File.separator + context.getPackageName());
        }
        localContentValues.put(MediaStore.Video.Media.TITLE, paramFile.getName());
        localContentValues.put(MediaStore.Video.Media.DISPLAY_NAME, paramFile.getName());
        localContentValues.put(MediaStore.Video.Media.MIME_TYPE, "video/mp4");
        localContentValues.put(MediaStore.Video.Media.DATE_TAKEN, timestamp);
        localContentValues.put(MediaStore.Video.Media.DATE_MODIFIED, timestamp);
        localContentValues.put(MediaStore.Video.Media.DATE_ADDED, timestamp);
        localContentValues.put(MediaStore.Video.Media.SIZE, paramFile.length());
        return localContentValues;
    }

    public static boolean insertMediaPic(Context context, String filePath, boolean isImg) {
        if (TextUtils.isEmpty(filePath)) return false;
        File file = new File(filePath);
        //判断android Q  (10 ) 版本
        if (isAdndroidQ()) {
            if (file == null || !file.exists()) {
                return false;
            } else {
                try {
                    if (isImg) {
                        MediaStore.Images.Media.insertImage(context.getContentResolver(), file.getAbsolutePath(), file.getName(), null);
                    } else {
                        ContentValues values = new ContentValues();
                        values.put(MediaStore.Video.Media.DATA, file.getAbsolutePath());
                        values.put(MediaStore.Video.Media.DISPLAY_NAME, file.getName());
                        values.put(MediaStore.Video.Media.MIME_TYPE, "video/*");
                        values.put(MediaStore.Video.Media.DATE_ADDED, System.currentTimeMillis() / 1000);
                        values.put(MediaStore.Video.Media.DATE_MODIFIED, System.currentTimeMillis() / 1000);
                        ContentResolver resolver = context.getContentResolver();
                        Uri uri = resolver.insert(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, values);
                    }
                    return true;
                } catch (Exception e) {
                    e.printStackTrace();
                    return false;
                }
            }
        } else {//老方法
            if (isImg) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Images.Media.DATA, file.getAbsolutePath());
                values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
                values.put(MediaStore.Images.ImageColumns.DATE_TAKEN,                     System.currentTimeMillis() + "");
                context.getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
                context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.parse("file://" + file.getAbsolutePath())));
            } else {
                ContentResolver localContentResolver = context.getContentResolver();
                ContentValues localContentValues = getVideoContentValues(new File(filePath), System.currentTimeMillis());
                Uri localUri = localContentResolver.insert(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, localContentValues);
                context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, localUri));
            }
            return true;
        }

    }
    public static boolean isAdndroidQ() {
        return Build.VERSION.SDK_INT >= 29;
    }

    public static ContentValues getVideoContentValues(File paramFile, long paramLong) {
        ContentValues localContentValues = new ContentValues();
        localContentValues.put(MediaStore.Video.Media.TITLE, paramFile.getName());
        localContentValues.put(MediaStore.Video.Media.DISPLAY_NAME, paramFile.getName());
        localContentValues.put(MediaStore.Video.Media.MIME_TYPE, "video/mp4");
        localContentValues.put(MediaStore.Video.Media.DATE_TAKEN, Long.valueOf(paramLong));
        localContentValues.put(MediaStore.Video.Media.DATE_MODIFIED, Long.valueOf(paramLong));
        localContentValues.put(MediaStore.Video.Media.DATE_ADDED, Long.valueOf(paramLong));
        localContentValues.put(MediaStore.Video.Media.DATA, paramFile.getAbsolutePath());
        localContentValues.put(MediaStore.Video.Media.SIZE, Long.valueOf(paramFile.length()));
        return localContentValues;
    }

    public static boolean refreshAlbum(Context context, String filePath) {
        File file = new File(filePath);
        if (!file.exists()) {
            return false;
        }

        Intent intent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
        Uri uri = Uri.fromFile(file);
        intent.setData(uri);
        context.sendBroadcast(intent);
        return true;
    }
}


