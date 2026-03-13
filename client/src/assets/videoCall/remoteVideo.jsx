import React, { useEffect } from "react"

export default function RemoteVideo({ remoteVideo, peerConnection, setChangeCamOverly }) {

    useEffect(() => {
        if (peerConnection) {
            // peerConnection.ontrack = ({ track, streams }) => {
            //     track.onunmute = () => {
            //       if (remoteVideo.current.srcObject) {
            //         return;
            //       }
            //       remoteVideo.current.srcObject = streams[0];
            //     };
            //   }
           peerConnection.ontrack = (event) => {
            console.log("TRACK RECEIVED")
            const remoteStream = event.streams[0]
             console.log("Remote stream received", remoteStream)

               if (remoteVideo.current) {
                remoteVideo.current.srcObject = remoteStream
               }
               }
                 return () => {
                if(remoteVideo.current) remoteVideo.current.srcObject = remoteStream
            }
        }
    }, [peerConnection])

    return <video id="remoteVideo"
        ref={remoteVideo} onClick={() => setChangeCamOverly(true)} autoPlay playsInline controls={false}
    ></video>

}