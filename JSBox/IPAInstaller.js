/*
IPA File Installer
- Support file sharing installation
- Support for file installation
- After the installation is complete, please return to the operation interface and select the subsequent operations

Author：longthinhiphone@gmail.com
*/

var port_number = 8080
var plist_url = "itms-services://?action=download-manifest&url=https://raw.githubusercontent.com/LongThinh/Developer/master/JSBox/Code.plist"

$app.strings = {
  "en": {
    "starterror": "Not support running in this way",
    "ftypeerror": " is not *.ipa file",
    "installtitle": "Installing...",
    "installmsg": "\n\nYou can check on Homescreen\nPlease tap \"Done\" button after finished",
    "inerrtitle": "*.ipa file import error",
    "inerrmsg": "Please rerun the Script"
  },
  
}

// Launch from within the app
if ($app.env == $env.app) {
  $drive.open({
    handler: function(data) {
      fileCheck(data)
    }
  })
}
// 从 Action Entension
else if ($app.env == $env.action) {
  fileCheck($context.data)
}

else {
  $ui.error($l10n("starterror"))
  delayClose(2)
}


function startServer(port) {
  $http.startServer({
    port: port,
    path: "",
    handler: function(result) {
      console.info(result.url)
    }
  })
}

function fileCheck(data) {
  if (data && data.fileName) {
    var fileName = data.fileName;
    if (fileName.indexOf(".ipa") == -1) {
      $ui.error(fileName + $l10n("ftypeerror"))
      delayClose(2)
    } else {
      install(fileName, data);
    }
  }
}

function install(fileName, file) {
  var result = $file.write({
    data: file,
    path: "app.ipa"
  })
  if (result) {
    startServer(port_number)
    $location.startUpdates({
      handler: function(resp) {
        console.info(resp.lat + " " + resp.lng + " " + resp.alt)
      }
    })
    var preResult = $app.openURL(plist_url);
    if (preResult) {
      $ui.alert({
        title: $l10n("installtitle"),
        message: "\n" + fileName + $l10n("installmsg"),
        actions: [{
          title: "Cancel",
          style: "Cancel",
          handler: function() {
            $http.stopServer()
            $file.delete("app.ipa")
            delayClose(0.2)
          }
        },
        {
          title: "Done",
          handler: function() {
            $http.stopServer()
            $file.delete("app.ipa")
            delayClose(0.2)
          }
        }]
      })
    } else {
      $ui.alert({
        title: "Open itms-services scheme failed",
        message: "Please contact the Author: Long Thinh",
        actions: [{
          title: "Cancel",
          style: "Cancel",
          handler: function() {
            delayClose(0.2)
          }
        },
        {
          title: "OK",
          handler: function() {
            $app.openURL("tg://resolve?domain=longthinhiphone@gmail.com")
          }
        }]
      })
    }
  } else {
    $ui.alert({
      title: $l10n("inerrtitle"),
      message: $l10n("inerrmsg"),
      actions: [{
        title: "OK",
        style: "Cancel",
        handler: function() {
          delayClose(0.2)
        }
      }]
    })
  }
}

function delayClose(time) {
    $location.stopUpdates()
    $thread.main({
      delay: time,
      handler: function() {
        if ($app.env == $env.action || $app.env == $env.safari) {
          $context.close()
        }
        $app.close()
      }
    })
}



