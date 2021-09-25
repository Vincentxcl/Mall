import axios from "axios";


let buildAjax = function buildAjax(baseSet) {
	return axios.create(baseSet);
}

export {
	buildAjax
};
