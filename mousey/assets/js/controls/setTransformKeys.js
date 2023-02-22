function setTranformKeys() {
        $('#canvas').hover(function() {
            this.focus();
        }, function() {
            this.blur();
        });
    
        $(window).keydown(function(event) {
        switch ( event.keyCode ) {
            case 81: // Q
                transformControls.setSpace( transformControls.space === 'local' ? 'world' : 'local' );
                break;

            case 16: // Shift
                transformControls.setTranslationSnap( 100 );
                transformControls.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
                transformControls.setScaleSnap( 0.25 );
                break;

            case 71: // G
                transformControls.setMode( 'translate' );
                break;

            case 82: // R
                transformControls.setMode( 'rotate' );
                break;

            case 83: // S
                transformControls.setMode( 'scale' );
                break;

            case 67: // C
                const position = currentCamera.position.clone();
                currentCamera = currentCamera.isPerspectiveCamera ? camera : cameraPersp;
                currentCamera.position.copy( position );
                controls.object = currentCamera;
                transformControls.camera = currentCamera;
                currentCamera.lookAt( controls.target.x, controls.target.y, controls.target.z );
                onWindowResize();
                break;

            case 86: // V
                const randomFoV = Math.random() + 0.1;
                const randomZoom = Math.random() + 0.1;
                camera.fov = randomFoV * 160;
                camera.bottom = - randomFoV * 500;
                camera.top = randomFoV * 500;
                cameraPersp.zoom = randomZoom * 5;
                camera.zoom = randomZoom * 5;
                onWindowResize();
                break;

            case 187:
            case 107: // +, =, num+
                transformControls.setSize( transformControls.size + 0.1 );
                break;

            case 189:
            case 109: // -, _, num-
                transformControls.setSize( Math.max( transformControls.size - 0.1, 0.1 ) );
                break;

            case 88: // X
                transformControls.showX = ! transformControls.showX;
                break;

            case 89: // Y
                transformControls.showY = ! transformControls.showY;
                break;

            case 90: // Z
                transformControls.showZ = ! transformControls.showZ;
                break;

            case 32: // Spacebar
                transformControls.enabled = ! transformControls.enabled;
                break;

            case 27: // Esc
                transformControls.reset();
                break;
        }
    });
    
    
    window.addEventListener( 'keyup', function ( event ) {
        switch ( event.keyCode ) {
            case 16: // Shift
                transformControls.setTranslationSnap( null );
                transformControls.setRotationSnap( null );
                transformControls.setScaleSnap( null );
                break;
        }
    });
}