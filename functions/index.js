const functions = require("firebase-functions");
const admin = require('firebase-admin');
const dotenv = require('dotenv')
dotenv.config()
admin.initializeApp();
const storage = admin.storage()

// Glober Talk
const nodemailer = require('nodemailer');

const makeString = function(arr) {
  if (!arr) return '';
  if (arr.length === 1) return arr[0];
  const firsts = arr.slice(0, arr.length - 1);
  const last = arr[arr.length - 1];
  return firsts.join(', ') + ' and ' + last;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: process.env.GLOBER_EMAIL,
      pass: process.env.GLOBER_PASS
  }
});

const sendEmail = function({toEmail, fromName, content}) {

    const mailOptions = {
      from: 'glober <glober.titech@gmail.com>', 
      to: toEmail,
      subject: `New Message from ${fromName || 'someone'}`, 
      html: content
    };

    return transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
          console.log(error)
          resolve(false);
      } else {
        console.log("Sent!")
        resolve(true);
      }

  })
}

// exports.sendMail = functions.runWith({memory: '2GB', timeoutSeconds: 120}).region('asia-northeast1')
// .firestore
// .document('contacts/{contactId}')
// .onCreate(async (snapshot, context) => {

//   const id = snapshot.id
//   const data = snapshot.data();

//   const toEmail = data.toEmail
//   const toName = data.toName? ' '+data.toName: ''
//   const fromName = data.fromName
//   const content = `<pre style="font-family: small/1.5 Arial,Helvetica,sans-serif; font-size: .875rem;">Hi${toName},

// You got a message from ${fromName || 'someone'}. 
// They know ${makeString(data.knows) || 'some languages'}. 
// They would like to learn ${(makeString(data.learning)) || 'some other languages'}.

// Their message to you:
// ${data.message || 'N/A'}

// —————
// Please go to glober chat to check the message.
// <a href="https://globerjp.com/chat">https://www.globerjp.com/chat</a>
// —————

// Best regards,
// glober
// ◆――――――――――――――――――

// glober, home in the world. An international community in Japan

// Contact:
// Email: glober.titech@gmail.com
// URL: <a href="https://globerjp.com">https://www.globerjp.com/</a>
// Facebook page: <a href="https://m.facebook.com/globerjp">https://m.facebook.com/globerjp</a>
// Instagram: @glober_japan
// Discord group: <a href="https://discord.gg/GsXejnWFJd">https://discord.gg/GsXejnWFJd</a>
//     </pre>`
//   await sendEmailPromise({toEmail,fromName,content})

// })

// Message Scheduling
// exports.resizeImagesFireStore = functions.runWith({memory: '2GB', timeoutSeconds: 120}).region('asia-northeast1')
//   .firestore
//   .document('chatRooms/{roomId}/chatMessages/{messageId}')
//   .onUpdate(async (change, context) => {
// })

const minutes = 300
// Schedule Notification
exports.scheduledFunction = functions.pubsub.schedule('every 3 minutes').onRun(async(context) => {
  const promises = []
  const now = new Date();
  const min5ago = new Date(now - minutes * 60000)
  const roomsRef = admin.firestore().collection('chatRooms')
  const users_hash = {}
  const messagesRef = roomId => roomsRef.doc(roomId).collection('chatMessages')
  // get all the rooms that was updated less than 5 minutes ago
  const rooms = await roomsRef
                .where('lastUpdated','>=',min5ago)
                .get()

  // get all users of each of those rooms
  rooms.forEach(room => {
    const id = room.id
    const data = room.data()
    console.log('roomid',id, data)
    users_hash[id] = new Set(data.users)
    promises.push(messagesRef(id)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get()
      .then(messages => {
        let out
        messages.forEach(message => {
          const id = message.id
          const data = message.data()
          out = {
            id,
            ...data
          }
        })
        return {
          roomId: id,
          ...out
        }
      })
      )
  })

  
  // get the latest messages from each of the updated chat rooms
  const messages = await Promise.all(promises)
  console.log('messages',messages)
  const send_user_ids = new Set()
  const sender_promises = []
  const promises2 = []

  messages.forEach(message => {
    const messageId = message.id
    const seen = message.seen? new Set(Object.keys(message.seen)) : new Set()
    const roomId = message.roomId
    const sender_id = message.sender_id
    sender_promises.push(
      admin.firestore().collection('users').doc(sender_id).get().then(
        user => {
          const id = user.id
          const data = user.data()
          return {
            id,
            ...data
          }
        }
      )
    )
    const all_user_ids = users_hash[roomId]
    all_user_ids.delete(sender_id)
    const sendUsersSet = new Set([...all_user_ids].filter((x) => !seen.has(x)))
    console.log('each all user, sender,seen, senduserset',all_user_ids, sender_id, seen, sendUsersSet)
    sendUsersSet.forEach(send_user => {
      if (!send_user_ids.has(send_user)) {
        send_user_ids.add(send_user)
        promises2.push(
          admin.firestore().collection('users').doc(send_user).get().then(doc => {
            const id = doc.id
            const data = doc.data()
            return {
              sender_id,
              id,
              ...data
            }
          })
        )
      }
     
    })
  })

  // get all users to whom to send email
  // console.log('send user ids',send_user_ids)

  // send_user_ids.forEach(send_user_id => {
  //   promises2.push(
  //     admin.firestore().collection('users').doc(send_user_id).get().then(doc => {
  //       const id = doc.id
  //       const data = doc.data()
  //       return {
  //         messageId
  //         id,
  //         ...data
  //       }
  //     })
  //   )
  // })
  const senders = await Promise.all(sender_promises)
  const users = await Promise.all(promises2)
  const sender_id_to_name = {}

  senders.forEach(sender => {
    sender_id_to_name[sender.id] = (!sender.profileShow || sender.profileShow.realName ? sender.firstName+" "+sender.lastName : (sender.nickName? sender.nickName : sender.firstName))
  })
  // const allUsers = await admin.firestore().collection('users').get().then(users => {
  //   const out = []
  //   users.forEach(user => {
  //     const id = user.id
  //     const data = user.data()
  //     out.push({
  //       id,
  //       ...data
  //     })
  //   })
  //   return out
  // })
  // console.log('allusers', allUsers)

  users.forEach(user => {
    const toEmail = user.email
    const toName = user.firstName? ' '+user.firstName: ''
    sendEmail({
        toEmail,
        fromName: sender_id_to_name[user.sender_id],
        content: `<pre style="font: small/1.5 Arial,Helvetica,sans-serif; font-size: .875rem;">Hi${toName},

You got a message. 

—————
Please go to glober chat to check the message.
<a href="https://globerjp.com/chat">https://www.globerjp.com/chat</a>
—————

Best regards,
glober
◆――――――――――――――――――

glober, home in the world. An international community in Japan

Contact:
Email: glober.titech@gmail.com
URL: <a href="https://globerjp.com">https://www.globerjp.com/</a>
Facebook page: <a href="https://m.facebook.com/globerjp">https://m.facebook.com/globerjp</a>
Instagram: @glober_japan
Discord group: <a href="https://discord.gg/GsXejnWFJd">https://discord.gg/GsXejnWFJd</a>
    </pre>`
        
      })

  })

  // await Promise.all(email_promises)

});



// Glober Image Optimization
// const { Storage } = require("@google-cloud/storage");
// const gcs = new Storage();

const sharp = require("sharp");
const fs = require("fs-extra");
const mime = require('mime');
const sizeOf = require('image-size');

const os = require("os");
const path = require("path");

const uuid = require('uuid');
const UUID = require("uuid-v4");


const Downloader = require("nodejs-file-downloader");
const {isEqual} = require('lodash')

const download = function(url, directory) {
  const downloader = new Downloader({
    url,
    directory 
  });
  try {
    return downloader.download().then(async e => {
      const stats = await fs.stat(e.filePath)
      return {...e, size: stats.size, fileName: decodeURIComponent(path.basename(e.filePath)), ext: path.extname(e.filePath)}
    });
  
  } catch (error) {
    console.log("Download failed", error);
  }
}

const upload = function(localFile, remoteFile) {
  
  let uuid = UUID();

  const fileType = mime.getType(localFile); 
  const bucket = storage.bucket()


  return bucket.upload(localFile, {
        destination: remoteFile,
        uploadType: "media",
        metadata: {
          contentType: fileType,
          metadata: {
            firebaseStorageDownloadTokens: uuid
          }
        }
      })
      .then((data) => {

          let file = data[0];
          
          const size = sizeOf(localFile);

          // const downloadUrl= "http://localhost:4001/v0/b/"+ bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid;
          
          const downloadUrl=  "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid;
          return {downloadUrl, size}
      });
}


exports.resizeImagesFireStore = functions.runWith({memory: '2GB', timeoutSeconds: 120}).region('asia-northeast1')
    .firestore
    .document('eventImages/{eventId}')
    .onUpdate(async (change, context) => {
      // Retrieve the current and previous value
      const uniqueName = uuid.v1();
      const changedDoc = change.after
      const id = changedDoc.id
      const dataPure = changedDoc.data();
      const sizes = [320, 640, 1280];
      const beforeDataPure = change.before.data();



      const data = dataPure.images
      const beforeData = beforeDataPure.images
      const resizedImages = dataPure.resizedImages

      if(!data) return
      

      if (resizedImages) {
        

        const filteredData = data.filter(e => !!e)

        const dataObj = {}
        filteredData.forEach(e => {
          dataObj[e.imageUrl] = e
        })


        if (isEqual(resizedImages, dataObj)) return

        for (const [key, val] of Object.entries(resizedImages)) {

          if (!dataObj.hasOwnProperty(key)) {
            for (const[k, value] of Object.entries(resizedImages[key])) {

              if (k.startsWith('filePath')) {
                try {
                  let ref = storage.bucket().file(value);
                  await ref.delete()
                } catch {
                  console.log('already deleted')
                }
                
              }
            }
            delete resizedImages[key]
          }
        }
      }



      
      const changedIndexes = [];
      data.forEach((e, i) => {
        if(!e.imageUrl || (resizedImages && resizedImages.hasOwnProperty(e.imageUrl)) ) return
        changedIndexes.push(i)
      })

      
      const workingDir = path.join(os.tmpdir(), `images_${id}_${uniqueName}`);


      await fs.ensureDir(workingDir);
      


      const tmpFilePaths = []

      const promises = []

      changedIndexes.forEach(async i => {
        if (!data[i].imageUrl) return
        const imageUrl = data[i].imageUrl

        promises.push(download(imageUrl, workingDir).then(e => {return {...e, index: i}}))
      
      })

 
      const result = await Promise.all(promises)


      const promises2 = []
      const promises3 = []
      
      result.forEach(async e=> {
        const dirName = path.dirname(e.fileName)
        const fileName = path.basename(e.fileName)
        const extName = path.extname(e.fileName)

        sizes.map(async size => {

          const thumbName = `image@${size}_${fileName}`;
          const thumbPath = path.join(workingDir, thumbName)
          const pathToFile = path.join(dirName,thumbName)
          const format = 'webp'

          const localSize = sizeOf(e.filePath);
          const altered_height = localSize.height > size ? size: localSize.height
          const altered_width = localSize.width > size ? size: localSize.width

          promises2.push(

            
            new Promise((resolve, reject) => {
              sharp(e.filePath)
                  .resize({width: altered_width,
                    height: altered_height,
                    fit: 'inside'})
                  .withMetadata()
                  .toFormat(format, { quality: size >= 400? 80 : 60 })
                  .toFile(`${thumbPath.split('.')[0]}.${format}`)
                  .then((f) => resolve({...f, index: e.index, thumbName: `${thumbName.split('.')[0]}.${format}`, thumbPath: `${thumbPath.split('.')[0]}.${format}`, fileName: e.fileName, dimension: size}))
                  .catch((e) => reject(e))
            })
            );

        })

    
      })

    const sharpPromises = await Promise.all(promises2)


    sharpPromises.forEach(e=> {
      const dirName = path.dirname(e.fileName)
      const fileName = path.basename(e.fileName)
      const extName = path.extname(e.fileName)

      const thumbName = e.thumbName;
      const thumbPath = e.thumbPath
      const pathToFile = path.join(dirName,thumbName)

      promises3.push(upload(thumbPath, pathToFile).then(f => {
        return {
          ...f, 
          ...e, 
          fileName: `image@${fileName}`, 
          filePath: pathToFile}
      }));
    })


     const output =  await Promise.all(promises3)
     


     const indexOutput = {}
     output.forEach(e => {
      if (indexOutput.hasOwnProperty(e.index)) {
        indexOutput[e.index].push(e)
      } else {
        indexOutput[e.index] = [e]
      }
     })

     const urlList = data.map((e,i) => {
      if (resizedImages && resizedImages[e.imageUrl]) return resizedImages[e.imageUrl]
      const res = {imageUrlOriginal: ''}
        sizes.forEach(e => {
          res[`imageUrl${e}`] = ''
          res[`filePath${e}`] = ''
        })
      
      if (!indexOutput.hasOwnProperty(i)) {
        return res
      }

      res.imageUrlOriginal = data[i].imageUrl

      if (!res['width']) res['width'] = indexOutput[i][0].width
      if (!res['height']) res['height'] = indexOutput[i][0].height


      indexOutput[i].forEach(e => {
        res[`imageUrl${e.dimension}`] = e.downloadUrl
        res[`filePath${e.dimension}`] = e.filePath
      })
      
      return res
     })

     const urlObj = {}
     urlList.forEach(e => {
      if (!e.imageUrlOriginal) return
      urlObj[e.imageUrlOriginal] = e
     })


      await change.after.ref.set({
        ...dataPure,
        resizedImages: urlObj
      }, {merge: false});

      await fs.remove(workingDir);

    });







