//JS控制图片按比例缩放，返回缩放后的尺寸对象
//当尺寸大于 iWidth&iHeight 时，等比例缩小至iWidth&iHeight
//如果有rate，当尺寸小于 iWidth&iHeight 时，而且比最小比例rate还要小，按照最小比例rate设置宽和高
export function adjustImgWH(imgObj, iWidth, iHeight, minRate) {
	if (imgObj.naturalWidth > 0 && imgObj.naturalHeight > 0) {

		let minWidth = iWidth//图片最小宽度
		let minHeight = iHeight//图片最小高度

		let enlarge = false;//低于设置的宽高后是否要放大
		if (minRate != undefined && /^0.[0-9]+$/.test(minRate)) {
			enlarge = true;
			minWidth = parseFloat(minRate) * iWidth;
			minHeight = parseFloat(minRate) * iHeight;
		}

		// 1.当图片的比例 较高 或者 等于设置
		if (imgObj.naturalHeight / imgObj.naturalWidth >= iHeight / iWidth) {

			// 1.1如果图片高度比设定的要高，就调节宽度
			if (imgObj.naturalHeight > iHeight) {
				imgObj.height = iHeight;
				imgObj.width = (imgObj.naturalWidth * iHeight) / imgObj.naturalHeight;
			}

			// 1.2如果图片高度小于或者等于设定高度
			else {
				if (imgObj.naturalHeight < minHeight && enlarge) {
					imgObj.height = minHeight;
					imgObj.width = (imgObj.naturalWidth * minHeight) / imgObj.naturalHeight;
				}
				else {
					imgObj.width = imgObj.naturalWidth;
					imgObj.height = imgObj.naturalHeight;
				}
			}
		}

		// 2.图片的比例 较宽 
		else {

			// 2.1如果图片宽度比设定的要宽，就调节高度
			if (imgObj.naturalWidth > iWidth) {
				imgObj.width = iWidth;
				imgObj.height = (imgObj.naturalHeight * iWidth) / imgObj.naturalWidth;
			}

			// 2.2如果图片宽度小于或者等于设定宽度
			else {
				if (imgObj.naturalWidth < minWidth && enlarge) {
					imgObj.width = minWidth;
					imgObj.height = (imgObj.naturalHeight * minWidth) / imgObj.naturalWidth;
				}
				else {
					imgObj.width = imgObj.naturalWidth;
					imgObj.height = imgObj.naturalHeight;
				}
			}
		}
	}
}
