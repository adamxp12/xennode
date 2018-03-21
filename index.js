
const Influx = require('influx')
const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'xenstats',
  schema: [
    {
      measurement: 'vmstats',
      fields: {
        vmcount: Influx.FieldType.INTEGER,
        vmpoweredcount: Influx.FieldType.INTEGER,
        vmunpoweredcount: Influx.FieldType.INTEGER,
        ramusage: Influx.FieldType.INTEGER
      },
      tags: [
        'host'
      ]
    }
  ]
})

setInterval(function() {

    var xenapi = require("xenapi2")({
    host: "10.0.6.9",
    port: "80"
});
xenapi.session.login("root", "rootpassword")
    .then(function () {
        xenapi.vmCollection.list().then(function (vms) {
            vmcount = vms.length;
            vmpoweredcount = 0;
            vmunpoweredcount = vmcount;
            totalram = 0;
            vms.forEach(function(vm) {
                if(vm.powerState === "Running") {
                    vmpoweredcount++;
                    vmunpoweredcount--;
                    ram = vm.ram/1000000000;
                    totalram +=ram;
                }
            })
                // console.log(vmcount);                
                // console.log(vmpoweredcount);
                // console.log(vmunpoweredcount);
                // console.log(Math.round(totalram));
                

                influx.writePoints([
      {
        measurement: 'vmstats',
        tags: { host: 'clyde' },
        fields: { vmcount, vmpoweredcount, vmunpoweredcount, ramusage: Math.round(totalram) },
      }
    ]).catch(err => {
      console.error(`Error saving data to InfluxDB! ${err.stack}`)
    })
        });
    });
}, 60 * 1000);
