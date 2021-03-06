bb8_control.service('audioService', function() {
  var callback = [];
  var service = {
      setCallback: function (ref) {
        callback.push(ref);
      },
      gainValue: 0
  };

  var audioContext = new AudioContext();

  console.log("audio is starting up ...");

  var BUFF_SIZE = 16384;

  var audioInput = null,
    microphone_stream = null,
    gain_node = null,
    script_processor_node = null,
    script_processor_fft_node = null,
    analyserNode = null;

  function gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];

      console.log(deviceInfo);

      /*option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'audioinput') {
        option.text = deviceInfo.label ||
          'microphone ' + (audioInputSelect.length + 1);
        audioInputSelect.appendChild(option);
      } else if (deviceInfo.kind === 'audiooutput') {
        option.text = deviceInfo.label || 'speaker ' +
          (audioOutputSelect.length + 1);
        audioOutputSelect.appendChild(option);
      } else if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
        videoSelect.appendChild(option);
      } else {
        console.log('Some other kind of source/device: ', deviceInfo);
      }*/
    }
  }

  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(function(e){console.error(e)});

  if (!navigator.getUserMedia)
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia;

  if (navigator.getUserMedia){

    navigator.getUserMedia({audio:{deviceId: "1386fa70f965237b3fb2d05fd4dbdca87ec9fb8676e9856b700e031a354cb8e3"}},
      function(stream) {
        start_microphone(stream);
      },
      function(e) {
        alert('Error capturing audio.');
      }
    );

  } else { alert('getUserMedia not supported in this browser.'); }

  // ---

  function show_some_data(given_typed_array, num_row_to_display, label) {

    var size_buffer = given_typed_array.length;
    var index = 0;
    var max_index = num_row_to_display;

    console.log("__________ " + label);

    for (; index < max_index && index < size_buffer; index += 1) {

      console.log(given_typed_array[index]);
    }
  }

  function aggregateData(given_typed_array, num_row_to_display) {
    var sum = 0;
    var size_buffer = given_typed_array.length;
    var index = 0;
    var max_index = num_row_to_display;


    for (; index < max_index && index < size_buffer; index += 1) {
      sum += given_typed_array[index];
    }
    return sum / Math.min(max_index, size_buffer);
  }

  function process_microphone_buffer(event) {

    var i, N, inp, microphone_output_buffer;

    microphone_output_buffer = event.inputBuffer.getChannelData(0); // just mono - 1 channel for now

    // microphone_output_buffer  <-- this buffer contains current gulp of data size BUFF_SIZE

    show_some_data(microphone_output_buffer, 5, "from getChannelData");
  }

  function start_microphone(stream){

    gain_node = audioContext.createGain();
    gain_node.gain.value = 0;
    gain_node.connect( audioContext.destination );

    microphone_stream = audioContext.createMediaStreamSource(stream);
    //microphone_stream.connect(gain_node);

    script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
    script_processor_node.onaudioprocess = process_microphone_buffer;

    microphone_stream.connect(script_processor_node);

    // --- enable volume control for output speakers

    /*document.getElementById('volume').addEventListener('change', function() {

      var curr_volume = this.value;
      gain_node.gain.value = curr_volume;

      console.log("curr_volume ", curr_volume);
    });*/

    // --- setup FFT

    script_processor_fft_node = audioContext.createScriptProcessor(2048, 1, 1);
    script_processor_fft_node.connect(gain_node);

    analyserNode = audioContext.createAnalyser();
    analyserNode.smoothingTimeConstant = 0;
    analyserNode.fftSize = 2048;

    microphone_stream.connect(analyserNode);

    analyserNode.connect(script_processor_fft_node);

    script_processor_fft_node.onaudioprocess = function() {

      // get the average for the first channel
      var array = new Uint8Array(analyserNode.frequencyBinCount);
      analyserNode.getByteFrequencyData(array);

      // draw the spectrogram
      if (microphone_stream.playbackState == microphone_stream.PLAYING_STATE) {
        service.gainValue = aggregateData(array, 5);
        callback.length ? callback.forEach(function(fn){fn();}) : '';
        //show_some_data(array, 5, "from fft");
      }
    };
  }

  return service;

});
