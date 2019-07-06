package com.saraththarayil.findmyguys;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import android.app.AlertDialog;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.ContextThemeWrapper;
import android.view.View;
import android.widget.Button;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;

import static androidx.core.app.NotificationCompat.PRIORITY_DEFAULT;

public class HomeActivityOld extends AppCompatActivity {

    Button btnlogout;
    FirebaseAuth mFirebaseAuth;
    private static final String CHANNEL_ID = "fmgmain";
    private static final String CHANNEL_NAME = "Find My Guys";
    private static final String CHANNEL_DESC = "Find My Guys Notification";

    private final void displayNotification(){
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.drawable.appiconsmall)
                .setContentTitle("Logged Out")
                .setContentText("Hey, you're logged out! Come back!!")
                .setPriority(PRIORITY_DEFAULT);

        NotificationManagerCompat mNotificationMgr = NotificationManagerCompat.from(this);
        mNotificationMgr.notify(1, mBuilder.build());
    }

    private FirebaseAuth.AuthStateListener mAuthStateListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_homeold);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_DEFAULT);
            channel.setDescription(CHANNEL_DESC);
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(channel);
        }

        FirebaseInstanceId.getInstance().getInstanceId().addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
            @Override
            public void onComplete(@NonNull Task<InstanceIdResult> task) {
                if(task.isSuccessful()){
                    String token = task.getResult().getToken();
                }
                else{

                }
            }
        });

        btnlogout = findViewById(R.id.logoutbutton);
        btnlogout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                displayNotification();
                FirebaseAuth.getInstance().signOut();
                startActivity(new Intent(HomeActivityOld.this,LoginActivity.class));

            }
        });

    }
    @Override
    public void onBackPressed() {
        new AlertDialog.Builder(new ContextThemeWrapper(this,android.R.style.Theme_Material_Light_Dialog_Alert ))
                .setMessage("Are you sure you want to exit?")
                .setCancelable(false)
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        HomeActivityOld.super.onBackPressed();
                    }
                })
                .setNegativeButton("No", null)
                .show();
    }


}

