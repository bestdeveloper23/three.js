$(document).ready(function(){

    const setKey_btn = document.querySelector('#btn_setkey');
    const setkey_time = document.querySelector('#setkey');
    const time_key = document.querySelector('#time_keyselect');
    const timeline_second = document.querySelector('#card_timeline_seconds');
    const deletekey_btn = document.querySelector('#btn_delkey');

    setKey_btn.addEventListener('click', (e) => {
        if(identify_key(setkey_time.value)) return ;
        camera_tween_positions.push(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
        camera_tween_rotations.push(new THREE.Vector3(camera.rotation.x, camera.rotation.y, camera.rotation.z));
        time_points.push(Number(setkey_time.value));

        let timeOption = document.createElement("option");
        timeOption.text = setkey_time.value;
        timeOption.value = setkey_time.value;
        time_key.appendChild(timeOption);

        let new_key = document.createElement("span");
        new_key.setAttribute('class', 'span_keys');
        new_key.setAttribute('id', 'keys'+setkey_time.value);
        let pos = Number(setkey_time.value);
        if(pos==0)new_key.setAttribute('style', 'bottom:50px; left:'+(pos*12)+'px')
        else new_key.setAttribute('style', 'bottom:50px; left:'+(pos*12-4)+'px');
        timeline_second.appendChild(new_key);
        
        set_resorting();
        set_durationarray();
    });

    deletekey_btn.addEventListener('click', (e) => {
        const index = time_key.selectedIndex;
        const value = time_key[index].value;

        time_key[index].remove();
        time_points.splice(index, 1);
        camera_tween_positions.splice(index, 1);
        camera_tween_rotations.splice(index, 1);
        console.log(document.querySelector('#keys'+value));
        document.querySelector('#keys'+value).remove();
        set_durationarray();

    })

    function identify_key(keytime){
        
        var flag =false;
        time_points.forEach(times => {
            if(times == keytime){
                flag = true;
            }            
        });
        return flag;
    }

    function set_durationarray(){
        if(time_points.length >= 2){
            time_durations = [];
            let number_points = time_points.length;
            for(let i=1; i<number_points; i++){
                time_durations.push(time_points[i]-time_points[i-1]);
            }
            
        };
    }

    function set_resorting(){
        let number_points = time_points.length;
        if( number_points>=2 ){
            for(let i=0; i<number_points-1; i++){
                for(let j=i+1; j<number_points; j++){
                    if(time_points[i] > time_points[j]){
                        swapElements(time_points, i, j);
                    }
                }
                time_key[i].value = time_points[i];
                time_key[i].text = time_points[i];
            }
            time_key[number_points-1].value = time_points[number_points-1];
            time_key[number_points-1].text = time_points[number_points-1];
            console.log(time_key);
        }
    }

    function swapElements(arr, i1, i2) {
        let temp = arr[i1];
        arr[i1] = arr[i2];
        arr[i2] = temp;
    }
});