import admin from 'firebase-admin';
let serviceAccount = {
    "type": "service_account",
    "project_id": "timedtasks",
    "private_key_id": "155de1cb1f67abfddd6ad37385682666d9a42b01",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCMPrDtCOK3LZck\nT2BR874w63i/BYMAwd/LSBTibtZi3Aw5GYSdluYzJY1CkRwl6GN14XFNQjiHoZ/y\n0pDaoYGcJ2uF7PMIMQKUhD41yjYYGbUH++SUTG5Cxn1WGYsgcp4zTVu0hnSuhayg\n7a5VzMQA37KnwnlQF/e809YYIKrWPoivXD+3dCbg9aK366FbwP78UgMP0P4mgqFQ\nTo2l1JovqVPw1yWioqbdkBbpMza5tqMJ1yqHkGghxTBNOJ5AlT0nGOqW6sGs7kPf\n3TATsQg/YmXRkQeYGpj0zuvQ4WUb4UPzd3sAMx0QbIKT/KLR/WEzWvjc+MIFdhXN\nVCSfvO4DAgMBAAECggEAHgGTzUNnbpXcjrJFA4PJH6Jh9UzymIjinxXPEhtw1zoJ\ni3YAP893dV4FeUae5SVxklkn6sXOXoagOE4BHCYOGyD8Cm2GGiySRsB8pvma1VE6\nwHiOkYRA2xyo2HEiqVCctJFKm7dg465KHyx7bnQfQ6iZCve7CP33zXjth8AFjU0G\nynqGDJNjEwpLSJJ8ntgX4K6A6L8WQplcceATht2wqPRlRSflubSJmQFYww4jmwLY\n0Fyd7IHne8jvZ/CL59hR2xQ7N8I8VL95pySc/4nUKaQvMRLp6X92NcC6b0twdORN\ng884OUH6s/pILOqsaby1Z+582BhnX2L1AkLRgV0YIQKBgQDCMF9J5xz5rZ4ZPjB4\nF/tckoNjgOweelUa0eNKim1grOgHYpP94zAZkRVfKn2FVGSKOcpBvG4dwUI9OqfZ\ndS4lT0KhNtlUojovqZFGZQwLTH3X2OQ5M4ZncQATpbqoBv0AlzclMkE6eO34X408\nStWpYZBAvDOr/4F2Q9Mpdu2nmwKBgQC44qXBSVu/SRRPCYcSBHrp226P8aDLDEDS\nflYhpJnOJc67a6mGSjuJuo1Own2hvyxq6SVeWSPltqP5FNSKqDL036ZD5fmd/Tu4\nqPt4REzr8WOuaM7IZaYzPtDZaNzEA2M3DZYt2XFt7h/IedU2wpRc7KGzJsWbYFu7\nTVTzDMrduQKBgQC1AyYv23FVBBPVb/T6XVB/0EsNW8W9+0aNg4ydlT+z2DlJeQh+\np2HU0zraxN7QhARcHNZ+RElZDybRsHV57RMg0CtJ37jifX5Do4q51cNOXPUJWTIU\naAUnM1xg9CF0M19vR4Wt9JR9DvC0j002IIPeKgWvcj+wWrGxLjQN+MA7dQKBgQCW\n4rmdxe2vbce6PS9Tf/6DzkYsCWlNbKGWZ+6JJFk1iVtvT40ZgImYfHwIU+fN0kRA\nuCd8GUmXlne5tstCocR8Xe3GKfCOhHVx3c7ktvED+Yt9ciGYIIUD+3bch5zsB0u4\nSUlP/853hcfAh9V/DEuijqfkmnbYuEoE0TbL6JvDWQKBgB3di7NetxLS/vdOao8m\nvAmTM3RX7gPjCjVifWHWv6UpIAvqJJLKYwYu5yti+4wLR2//hrHQu8km+aCGSZMo\neEd2n8Sl6M3p1GOQElPNsEPe7I0YWHYPR8u8/zdWZjSdu451HTY8OuPv3XnlgBhJ\nhNiy+lJXJCoqRmFzqCJ3kuWO\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fpayi@timedtasks.iam.gserviceaccount.com",
    "client_id": "106123499084770527483",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fpayi%40timedtasks.iam.gserviceaccount.com"
  }

admin.initializeApp({
    
    credential: admin.credential.cert((serviceAccount))
})

export default admin