$(document).ready(function(){
    var wavesurfer = WaveSurfer.create({
        container: "#waveform",
        waveColor: 'violet',
        progressColor: 'purple',
        height: 50,
        timeInterval: 720
    });
    wavesurfer.load('assets/audio/audio.mp3');
    wavesurfer.on('ready', function () {
        
        console.log(wavesurfer.isPlaying() + "umumum...");
    });
    console.log(wavesurfer.isPlaying() );
    wavesurfer.toggleScroll();
    audio_in = wavesurfer;
});