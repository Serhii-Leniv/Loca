import { ArrowLeft, Smartphone, Monitor, Tablet, LogOut } from 'lucide-react';
import { Link } from 'react-router';

export default function ConnectedDevices() {
  const devices = [
    {
      id: 1,
      name: 'iPhone 14 Pro',
      type: 'mobile',
      location: 'Київ, Україна',
      lastActive: 'Зараз активний',
      isCurrent: true,
    },
    {
      id: 2,
      name: 'MacBook Pro 16"',
      type: 'desktop',
      location: 'Київ, Україна',
      lastActive: '2 години тому',
      isCurrent: false,
    },
    {
      id: 3,
      name: 'iPad Air',
      type: 'tablet',
      location: 'Львів, Україна',
      lastActive: 'Вчора о 18:24',
      isCurrent: false,
    },
    {
      id: 4,
      name: 'iPhone 12',
      type: 'mobile',
      location: 'Одеса, Україна',
      lastActive: '3 дні тому',
      isCurrent: false,
    },
  ];

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return Smartphone;
      case 'desktop':
        return Monitor;
      case 'tablet':
        return Tablet;
      default:
        return Smartphone;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-8">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <Link to="/settings" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[24px] font-semibold text-white">Підключені пристрої</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-6 space-y-6">

        {/* Info */}
        <div className="px-4 py-3 rounded-xl bg-purple-900/20 border border-purple-500/20">
          <p className="text-[12px] text-gray-300 leading-relaxed">
            Тут відображаються всі пристрої, на яких ви увійшли в свій акаунт. Якщо ви не впізнаєте пристрій, відключіть його.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 py-4">
          <div className="text-center">
            <p className="text-[20px] font-semibold text-white mb-1">{devices.length}</p>
            <p className="text-[12px] text-gray-400">Всього пристроїв</p>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="text-center">
            <p className="text-[20px] font-semibold text-purple-400 mb-1">
              {devices.filter(d => d.lastActive.includes('Зараз') || d.lastActive.includes('години')).length}
            </p>
            <p className="text-[12px] text-gray-400">Активних</p>
          </div>
        </div>

        {/* Devices List */}
        <div>
          <h3 className="text-[13px] font-medium text-gray-400 uppercase tracking-wide px-2 mb-3">
            Мої пристрої
          </h3>
          <div className="space-y-3">
            {devices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.type);
              return (
                <div
                  key={device.id}
                  className={`rounded-2xl bg-white/5 border p-4 transition-all ${
                    device.isCurrent
                      ? 'border-purple-500/30 bg-purple-900/10'
                      : 'border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      device.isCurrent ? 'bg-purple-500/20' : 'bg-white/10'
                    }`}>
                      <DeviceIcon className={`w-6 h-6 ${
                        device.isCurrent ? 'text-purple-400' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-[15px] font-medium text-white">{device.name}</h4>
                        {device.isCurrent && (
                          <span className="px-2 py-1 rounded-md bg-purple-500/20 text-[10px] font-medium text-purple-400 uppercase tracking-wide">
                            Цей пристрій
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-gray-400 mb-1">{device.location}</p>
                      <p className="text-[12px] text-gray-500">{device.lastActive}</p>
                    </div>
                  </div>
                  {!device.isCurrent && (
                    <button className="w-full mt-4 py-2.5 rounded-lg bg-white/5 border border-red-500/30 hover:bg-red-500/10 flex items-center justify-center gap-2 transition-all">
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span className="text-[13px] font-medium text-red-400">Відключити пристрій</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Disconnect All */}
        <div className="pt-4">
          <button className="w-full py-4 rounded-xl bg-white/5 border border-red-500/30 hover:bg-red-500/10 flex items-center justify-center gap-2 transition-all">
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="text-[15px] font-medium text-red-400">Відключити всі інші пристрої</span>
          </button>
          <p className="text-[11px] text-gray-500 text-center mt-3">
            Всі пристрої, крім поточного, будуть відключені
          </p>
        </div>

      </div>
    </div>
  );
}
