import * as THREE from 'three';
import { LatToScale, YToLat } from './Utils.mjs';

export async function IMesh(inmesh, positions, normalsRight, normalsUp, inverseMatrix) {
    let matrix = new THREE.Matrix4();
    let position = new THREE.Vector3();
    let rotation = new THREE.Euler();
    let quaternion = new THREE.Quaternion();
    let scale = new THREE.Vector3();

    let geometry = inmesh.geometry;
    geometry.applyMatrix4(inmesh.matrixWorld); // apply world modifiers to geometry

    let material = inmesh.material;
    let instancedMesh = new THREE.InstancedMesh(geometry, material, positions.length / 3);
    instancedMesh.userData = inmesh.userData;

    for (let i = 0; i < positions.length; i += 3) {
        position = {
            x: positions[i] + inverseMatrix.elements[12],
            y: positions[i + 1] + inverseMatrix.elements[13],
            z: positions[i + 2] + inverseMatrix.elements[14]
        };

        rotation.set(0, 0, Math.atan2(normalsRight[i + 1], normalsRight[i]));
        quaternion.setFromEuler(rotation);
        scale.x = scale.y = scale.z = LatToScale(YToLat(positions[i + 1]));
        matrix.compose(position, quaternion, scale);
        instancedMesh.setMatrixAt(i / 3, matrix);
    }

    return instancedMesh;
}
