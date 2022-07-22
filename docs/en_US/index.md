# Autoconsommation Plugin

**Jeedom** plugin to optimise electrical auto-consumption (in case of solar power plan).

# Plugin configuration
After downloading the plugin, you just need to activate it, there is no configuration at this level.

# Equipment configuration
## Equipment tab
In the *General settings* section, you find the usual parameters of a **Jeedom** plugin.

The *Specific parameters* allow to configure what is needed to run the plugin instance.
![Specific parameters](../images/specificParameters.png)

- **Final injection** : Equipment info with the total instant situation of electrical injection for the house (mandatory)
- **Solar production**: Equipment info with the instant electrical production from the solar inverter (optional)
- **Security margin**: Fixed value or equipment info to define a security margin of minimum injection to consider in the regulation
- **Backup cron**: Cron expression to run the optimization algorithm at a regular pace (in case the triggers would not be sufficient)

**Note**: All the power information is considered as injection back to the grid. (This allows to be consistent with a positive power from the solar inverter.)

## Commands tab
The *Commands tab* holds only the default action that runs the optimization algorithm.

There is nothing to configure here.

##Equipment table tab

The *Equipment table* tab allows to list the equipments that will be controlled when optimizing auto-consumption.
![Equipment table](../images/equipmentTable.png)


