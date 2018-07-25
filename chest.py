import socket
import serial
import os
data = '/tmp/chest.sock'



# TODO: Replace with the serial port where your local module is connected to.
PORT = "/dev/tty.usbmodem1421"
# TODO: Replace with the baud rate of your local module.
BAUD_RATE = 9600

def main():
    if os.path.exists("/tmp/chest.sock"):
        os.remove("/tmp/chest.sock")
    ser = serial.Serial(PORT ,BAUD_RATE)
    socketServer = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    socketServer.bind(data)
    socketServer.listen(10)
    socketConnection, _ = socketServer.accept()
    while 1 :
       	msg = ser.readline().decode()
        msg = msg.replace('\n', '').replace('\r', '')
        msg = msg.split(',')
        msg = ','.join(msg).encode('UTF-8')
        socketConnection.send(msg)





if __name__ == '__main__':
    main()