from flask import Flask, render_template,request

import numpy as np
import cv2 as cv

import imutils

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route('/apply_filter',methods=['GET','POST'])
def apply_filter():

    #get data in the form of json
    data = request.get_json()
    
    #read image
    img = cv.imread(data['img'],0)

    #read json values to pyhon variables
    interpolation = data['interpolation']
    height, width = img.shape[:2]

    #interpolate image
    if(interpolation=="nearest"):
        res= cv.resize(img,(2*width, 2*height), interpolation = cv.INTER_NEAREST)
        
    elif(interpolation=="bicubic"):
        res = cv.resize(img,(2*width, 2*height), interpolation = cv.INTER_CUBIC)
    elif(interpolation=="bilinear"):
        res = cv.resize(img,(2*width, 2*height), interpolation = cv.INTER_LINEAR)
    
    #processing
    if(data['input']=="scaling"):
        scale_percent =int(data["scaling"]["s_value"])
        width = int(res.shape[1] * scale_percent / 100)
        height = int(res.shape[0] * scale_percent / 100)
        dim = (width, height)
        res = cv.resize(img, dim)

    elif(data['input']=="rotation"):
        angle=int(data["rotation"])
        res = imutils.rotate(res, angle)
    elif(data['input']=="translation"):
        x=int(data["translation"]["x_val"])
        y=int(data["translation"]["y_val"])
        rows,cols = res.shape
        M = np.float32([[1,0,x],[0,1,y]])
        res = cv.warpAffine(res,M,(cols,rows))
    
    #return img
    status=cv.imwrite('static/img/result.jpeg',res)
    #res.save("static/img/rotated_picture.jpg") 
    if(status):
        return ("img/result.jpeg")
        

@app.route('/')
def first():
    return render_template('index.html')


if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate,public, post-check=0, pre-check=0, max-age=0"
        response.headers["Expires"] = -1
        response.headers["Pragma"] = "no-cache"
        if 'Cache-Control' not in response.headers:
            response.headers['Cache-Control'] = 'no-store'
        return response

if __name__ == '__main__':
	app.run(use_reloader=True,debug = True)
