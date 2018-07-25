from digi.xbee.devices import XBeeDevice
import csv
import socket
import json
import os
data = '/tmp/data.sock'



# TODO: Replace with the serial port where your local module is connected to.
PORT = "/dev/tty.usbserial-A9C371P1"
# TODO: Replace with the baud rate of your local module.
BAUD_RATE = 9600

def main():
    if os.path.exists("/tmp/data.sock"):
        os.remove("/tmp/data.sock") 

    device = XBeeDevice(PORT, BAUD_RATE)
    
    socketServer = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    socketServer.bind(data)
    socketServer.listen(10)
    socketConnection, _ = socketServer.accept()

    try:
        device.open()
        def data_receive_callback(xbee_message):
            print("From %s >> %s" % (xbee_message.remote_device.get_16bit_addr(),
                                     xbee_message.data.decode()))
            list = xbee_message.data.decode()
            list = list.replace('\n', ' ').replace('\r', '').replace('\x00', '')
            list = list.split(',')
            msg = ','.join(list).encode('UTF-8')
            socketConnection.send(msg)

        device.add_data_received_callback(data_receive_callback)
        print("Waiting for data...\n")
        input()
    except Error:
        main()
    finally:
        if device is not None and device.is_open():
            device.close()
        socketServer.close()
    


if __name__ == '__main__':
    main()