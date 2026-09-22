import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network, Globe, Server, Shield, Activity, Zap, Check, Copy,
  ArrowRight, BookOpen, Layers, Search, SlidersHorizontal, RefreshCw,
  AlertCircle, HelpCircle, ChevronDown, ChevronRight, Cpu, Radio,
  ExternalLink, HardDrive, Wifi, ShieldAlert, Award, Terminal
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// CIDR Calculator Helper Functions
// ─────────────────────────────────────────────
function parseIpv4(ipStr: string): number[] | null {
  const parts = ipStr.trim().split(".");
  if (parts.length !== 4) return null;
  const nums = parts.map((p) => Number(p));
  for (const n of nums) {
    if (isNaN(n) || n < 0 || n > 255 || !Number.isInteger(n)) return null;
  }
  return nums;
}

function ipToLong(octets: number[]): number {
  return (
    ((octets[0] << 24) >>> 0) +
    ((octets[1] << 16) >>> 0) +
    ((octets[2] << 8) >>> 0) +
    (octets[3] >>> 0)
  );
}

function longToIp(long: number): string {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255,
  ].join(".");
}

// ─────────────────────────────────────────────
// Interactive OSI / TCP-IP Models Data
// ─────────────────────────────────────────────
interface LayerInfo {
  id: string;
  name: string;
  osiLayer: string;
  tcpLayer: string;
  protocols: string[];
  devopsRole: string;
  failureModes: string[];
  tools: string[];
  sampleCommand: string;
  color: string;
}

const LAYERS: LayerInfo[] = [
  {
    id: "l7",
    name: "Application & Service",
    osiLayer: "Layer 7 (Application)",
    tcpLayer: "Application Layer",
    protocols: ["HTTP/1.1", "HTTP/2", "gRPC", "DNS", "TLS 1.3", "WebSockets"],
    devopsRole: "Where APIs, microservices, Ingress controllers, and reverse proxies route user traffic. Handlers, certificates, and header rewrites operate here.",
    failureModes: [
      "HTTP 502 Bad Gateway (Upstream application pod dead or unreachable)",
      "HTTP 504 Gateway Timeout (Upstream processing took longer than proxy read_timeout)",
      "TLS Certificate Expired / Hostname Mismatch error",
      "gRPC RST_STREAM frame disconnects due to keepalive ping timeouts",
    ],
    tools: ["curl -Iv", "openssl s_client", "grpcurl", "httpie", "dig +trace"],
    sampleCommand: "curl -Iv --connect-timeout 5 -H 'Host: api.internal' https://10.0.4.12/healthz",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "l4",
    name: "Transport & Sockets",
    osiLayer: "Layer 4 (Transport)",
    tcpLayer: "Host-to-Host (Transport)",
    protocols: ["TCP", "UDP", "QUIC", "SCTP"],
    devopsRole: "End-to-end logical byte streaming, connection multiplexing, congestion control, port mapping, and Layer 4 load balancing (AWS NLB, HAProxy).",
    failureModes: [
      "TIME_WAIT socket accumulation exhausting ephemeral port ranges",
      "TCP Connection Refused (ECONNREFUSED - no process listening on targeted port)",
      "SYN Flood / Half-open socket attacks exhausting TCP backlog queue",
      "TCP Window exhaustion causing severe throughput collapse over high latency links",
    ],
    tools: ["ss -tulnp", "netstat -an", "nc -zv", "tcpdump", "lsof -i"],
    sampleCommand: "ss -tulnp | grep -E ':(80|443|6443|8080)'",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "l3",
    name: "Network & Packet Routing",
    osiLayer: "Layer 3 (Network)",
    tcpLayer: "Internet Layer",
    protocols: ["IPv4", "IPv6", "ICMP", "IPsec", "BGP", "NAT"],
    devopsRole: "Hop-by-hop packet addressing, VPC route tables, Internet/NAT Gateways, and Kubernetes overlay network encapsulation (VXLAN/Geneve).",
    failureModes: [
      "Asymmetric routing or missing route table entry to target CIDR block",
      "Path MTU discovery black hole (DF bit set, router silently drops oversized packet without ICMP Fragmentation Needed)",
      "NAT Gateway bandwidth throttling or port allocation exhaustion (SNAT drops)",
      "Subnet IP address exhaustion blocking new EC2/Pod launch",
    ],
    tools: ["ip route", "traceroute -T", "ping", "mtr", "iptables -t nat -L"],
    sampleCommand: "ip route get 8.8.8.8",
    color: "from-indigo-500 to-violet-600",
  },
  {
    id: "l2",
    name: "Data Link & Interfaces",
    osiLayer: "Layer 2 (Data Link)",
    tcpLayer: "Network Interface (Link)",
    protocols: ["Ethernet", "MAC Addressing", "ARP", "VLAN (802.1Q)", "VXLAN"],
    devopsRole: "Hardware interface communication on the local broadcast domain. In Linux/containers: veth pairs, bridge devices (docker0, cbr0), and CNI virtual switching.",
    failureModes: [
      "ARP table overflow or duplicate MAC addresses across virtual NICs",
      "veth pair detached or bridge interface administratively down",
      "MTU mismatch between physical network interface and container overlay interface (e.g. 1500 vs 1450)",
    ],
    tools: ["ip link", "arp -a", "bridge link", "ethtool eth0"],
    sampleCommand: "ethtool eth0 | grep -i speed",
    color: "from-violet-500 to-purple-600",
  },
];

// ─────────────────────────────────────────────
// Linux Networking Commands Studio
// ─────────────────────────────────────────────
interface CliCommand {
  id: string;
  category: "Sockets & Ports" | "DNS & Connectivity" | "Packet Capture" | "Routing & NAT" | "Firewall";
  command: string;
  title: string;
  description: string;
  flagsBreakdown: string;
  sampleOutput: string;
}

const COMMANDS: CliCommand[] = [
  {
    id: "cmd-ss",
    category: "Sockets & Ports",
    command: "ss -tulnp",
    title: "Inspect Listening TCP/UDP Sockets & PIDs",
    description: "Lightning-fast kernel socket inspection. Replaces obsolete netstat to see what ports are open and which process holds them.",
    flagsBreakdown: "-t: TCP, -u: UDP, -l: Listening only, -n: Numeric IPs/ports (no DNS delays), -p: Process name & PID",
    sampleOutput: `Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
tcp   LISTEN 0      128    0.0.0.0:80          0.0.0.0:*     users:(("nginx",pid=1420,fd=6))
tcp   LISTEN 0      128    0.0.0.0:6443        0.0.0.0:*     users:(("kube-apiserver",pid=842,fd=3))
tcp   LISTEN 0      512    127.0.0.1:2379      0.0.0.0:*     users:(("etcd",pid=651,fd=7))`,
  },
  {
    id: "cmd-curl",
    category: "DNS & Connectivity",
    command: "curl -Iv --connect-timeout 5 https://api.prod.company.com/v1/health",
    title: "Verbose HTTP & TLS Handshake Inspection",
    description: "Outputs the complete TCP connection phase, TLS 1.3 handshake negotiation, certificate validation, and response headers.",
    flagsBreakdown: "-I: Fetch headers only (HEAD), -v: Verbose handshake/debug info, --connect-timeout 5: Abort after 5s",
    sampleOutput: `* Trying 10.0.2.45:443...
* Connected to api.prod.company.com (10.0.2.45) port 443
* ALPN: offers h2,http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
< HTTP/2 200 
< content-type: application/json
< x-envoy-upstream-service-time: 4`,
  },
  {
    id: "cmd-dig",
    category: "DNS & Connectivity",
    command: "dig +trace +nodnssec api.stripe.com",
    title: "Full Iterative DNS Query Trace",
    description: "Traces resolution from the 13 root DNS servers through TLD (.com) down to Stripe's authoritative nameservers.",
    flagsBreakdown: "+trace: Iterative step-by-step resolution from root, +nodnssec: Suppress DNSSEC validation records for readability",
    sampleOutput: `.                       518400  IN  NS  a.root-servers.net.
com.                    172800  IN  NS  a.gtld-servers.net.
stripe.com.             172800  IN  NS  ns-1212.awsdns-23.org.
api.stripe.com.         300     IN  A   54.187.159.182`,
  },
  {
    id: "cmd-tcpdump",
    category: "Packet Capture",
    command: "sudo tcpdump -nn -i any 'tcp port 443 and (tcp[tcpflags] & (tcp-syn|tcp-fin) != 0)' -c 10",
    title: "Capture TCP Connection Handshakes & Teardowns",
    description: "Filters only SYN (connection start) and FIN (connection teardown) packets on port 443 across all network interfaces.",
    flagsBreakdown: "-nn: Don't resolve hostnames or ports, -i any: Listen across all NICs, -c 10: Exit after 10 packets",
    sampleOutput: `15:42:01.102 IP 10.244.1.18.54210 > 10.0.12.8.443: Flags [S], seq 389218201, win 64240
15:42:01.103 IP 10.0.12.8.443 > 10.244.1.18.54210: Flags [S.], seq 912837192, ack 389218202
15:42:01.104 IP 10.244.1.18.54210 > 10.0.12.8.443: Flags [.], ack 1, win 64240`,
  },
  {
    id: "cmd-ip-route",
    category: "Routing & NAT",
    command: "ip route get 8.8.8.8",
    title: "Find Kernel Route & Source Interface for IP",
    description: "Simulates kernel route table lookup for destination IP, printing the exact egress interface, gateway, and source IP used.",
    flagsBreakdown: "get <IP>: Query kernel routing cache for single destination",
    sampleOutput: `8.8.8.8 via 192.168.1.1 dev eth0 src 192.168.1.105 uid 1000
    cache `,
  },
  {
    id: "cmd-nc",
    category: "Sockets & Ports",
    command: "nc -zv -w 3 10.0.4.12 6379",
    title: "Test Remote Port Reachability (Netcat)",
    description: "Checks if a remote TCP port (e.g. Redis on 6379) is accepting connections through firewalls and Security Groups.",
    flagsBreakdown: "-z: Zero-I/O mode (scan without sending payload), -v: Verbose output, -w 3: Timeout after 3 seconds",
    sampleOutput: `Connection to 10.0.4.12 6379 port [tcp/redis] succeeded!`,
  },
  {
    id: "cmd-iptables",
    category: "Firewall",
    command: "sudo iptables -t nat -L -n -v | grep -E '(PREROUTING|POSTROUTING|KUBE-)'",
    title: "Inspect NAT & Kubernetes Service Forwarding",
    description: "Views kernel NAT translation rules used by Docker (container port mapping) and kube-proxy for ClusterIP load balancing.",
    flagsBreakdown: "-t nat: Network Address Translation table, -L: List rules, -n: Numeric format, -v: Verbose packet counters",
    sampleOutput: `Chain PREROUTING (policy ACCEPT 142K packets, 8520K bytes)
pkts bytes target      prot opt in  out source     destination
420K  25M  KUBE-SERVICES all  --  *   *   0.0.0.0/0  0.0.0.0/0`,
  },
  {
    id: "cmd-mtr",
    category: "DNS & Connectivity",
    command: "mtr -rw -c 10 --tcp -P 443 api.stripe.com",
    title: "MTR (My Traceroute) with TCP Packet Probing",
    description: "Combines ping and traceroute using TCP SYN packets on port 443, pinpointing the exact router hop dropping packets.",
    flagsBreakdown: "-r: Report mode, -w: Wide output format, -c 10: Send 10 packets per hop, --tcp -P 443: Probe TCP port 443",
    sampleOutput: `HOST: devops-node-01          Loss%   Snt   Last   Avg  Best  Wrst StDev
  1.|-- 10.0.0.1               0.0%    10    0.4   0.5   0.4   0.7   0.1
  2.|-- 100.64.0.1             0.0%    10    1.2   1.4   1.1   2.3   0.3
  3.|-- 54.187.159.182         0.0%    10   12.1  12.4  11.9  14.2   0.6`,
  },
];

// ─────────────────────────────────────────────
// Kubernetes CNI Matrix Data
// ─────────────────────────────────────────────
const CNI_OPTIONS = [
  {
    id: "calico",
    name: "Calico CNI",
    badge: "Enterprise Standard",
    description: "Industry-proven networking plugin supporting both pure Layer 3 flat routed networks (via BGP) and overlay networks (VXLAN/IPIP) with rich NetworkPolicy enforcement.",
    architecture: "BGP route peering between cluster nodes + iptables / eBPF dataplane. Assigns IP per pod from IPAM blocks.",
    pros: [
      "Native BGP mode avoids encapsulation overhead for bare-metal / on-prem",
      "Extensive NetworkPolicy engine (global policies, egress rules, DNS-based policies)",
      "Supports WireGuard automated pod-to-pod encryption",
    ],
    cons: [
      "Requires BGP router peering knowledge for non-overlay setups",
      "iptables mode can become slow in huge clusters with 50K+ services",
    ],
    bestFor: "Enterprises needing zero-trust NetworkPolicies, compliance, and multi-cloud consistency.",
  },
  {
    id: "cilium",
    name: "Cilium CNI",
    badge: "eBPF Next-Gen",
    description: "Revolutionary eBPF-powered networking, observability, and security. Bypasses iptables entirely for O(1) packet routing directly within the Linux kernel.",
    architecture: "Injects eBPF bytecode programs into kernel socket and TC (traffic control) hooks. Replaces kube-proxy completely.",
    pros: [
      "Extreme performance with zero iptables overhead",
      "Built-in Hubble UI for deep packet observability and service map visualization",
      "Native Layer 7 policy enforcement (HTTP paths, methods, headers, Kafka topics)",
      "Transparent mTLS encryption with WireGuard / IPsec without sidecars",
    ],
    cons: [
      "Requires modern Linux kernel (5.4+ or 5.10+ recommended)",
      "Debugging eBPF kernel state requires specialized tooling",
    ],
    bestFor: "High-scale clusters, low-latency microservices, and modern observability-driven teams.",
  },
  {
    id: "flannel",
    name: "Flannel",
    badge: "Lightweight & Simple",
    description: "A very simple and lightweight overlay network that satisfies the Kubernetes networking model using VXLAN encapsulation.",
    architecture: "Small daemon agent (flanneld) per node allocating a subnet per host. Packs pod packets into UDP VXLAN frames (port 8472).",
    pros: [
      "Minimal resource footprint; starts in seconds",
      "Almost zero configuration required",
      "Ideal for edge clusters, K3s, and development environments",
    ],
    cons: [
      "No native NetworkPolicy support (must pair with Calico in policy-only mode)",
      "VXLAN packet encapsulation adds minor CPU and MTU overhead",
    ],
    bestFor: "Edge computing, dev/test clusters, K3s, and educational sandbox environments.",
  },
  {
    id: "aws-vpc",
    name: "AWS VPC CNI",
    badge: "AWS Native",
    description: "Directly assigns secondary private IPv4/IPv6 addresses from AWS VPC subnets to Kubernetes Pods via Elastic Network Interfaces (ENIs).",
    architecture: "ipam daemon attaches ENIs to EC2 worker nodes. Pods receive real VPC IP addresses routable from anywhere in the VPC.",
    pros: [
      "Pods are first-class VPC citizens; no NAT required between Pods and EC2/RDS",
      "Supports AWS Security Groups directly attached to individual Pods",
      "Native AWS CloudWatch VPC Flow Logs capture pod traffic seamlessly",
    ],
    cons: [
      "Can quickly exhaust VPC subnet IP addresses without prefix delegation",
      "Node pod capacity is constrained by EC2 instance ENI limits",
    ],
    bestFor: "EKS clusters that heavily communicate with AWS services (RDS, ElastiCache, other VPCs).",
  },
];

// ─────────────────────────────────────────────
// Troubleshooting Playbooks Data
// ─────────────────────────────────────────────
const TROUBLESHOOTING_PLAYBOOKS = [
  {
    id: "tb-1",
    title: "HTTP 502 Bad Gateway from Nginx Ingress / Reverse Proxy",
    tag: "Layer 7 / Proxy",
    symptom: "Clients receive HTTP 502 Bad Gateway responses intermittently or during traffic spikes.",
    rootCause: "The reverse proxy (Nginx/Envoy) contacted the upstream pod IP, but the TCP connection was rejected (ECONNREFUSED) or the upstream closed the socket prematurely.",
    diagnosisSteps: [
      "Check Ingress controller logs: `kubectl logs -n ingress-nginx deployment/ingress-nginx-controller | grep 502`.",
      "Verify target Pod endpoints: `kubectl get endpoints <service-name>` — if endpoints list is `<none>`, the readiness probe failed or selector is wrong.",
      "Check upstream keepalive timeout mismatch: If upstream server closes idle keepalive connection at 60s while Ingress proxy keepalive is 65s, proxy sends request on dead socket.",
      "Exec into node/bastion and test upstream directly: `curl -Iv http://<pod-ip>:<port>/healthz`.",
    ],
    remediation: "1. Fix pod readiness probe failures.\n2. Ensure upstream server keepalive timeout is longer than Nginx proxy timeout (`keepalive_timeout 75s;`).\n3. Enable upstream retries in Ingress annotations: `nginx.ingress.kubernetes.io/proxy-next-upstream: error timeout http_502`.",
  },
  {
    id: "tb-2",
    title: "Kubernetes CoreDNS Timeout & ndots:5 Latency Spikes",
    tag: "DNS / Kubernetes",
    symptom: "Pod HTTP requests to external domains (e.g. api.stripe.com, s3.amazonaws.com) take 5 to 10 seconds or fail with DNS resolution timeouts.",
    rootCause: "By default, Kubernetes configures `/etc/resolv.conf` with `options ndots:5`. Any domain with fewer than 5 dots tries all local search domains first before querying the public domain.",
    diagnosisSteps: [
      "Check pod /etc/resolv.conf: `kubectl exec -it <pod> -- cat /etc/resolv.conf`.",
      "Observe that `api.stripe.com` (2 dots) first triggers lookups for `api.stripe.com.default.svc.cluster.local`, then `api.stripe.com.svc.cluster.local`, causing 4 NXDOMAIN errors before resolution.",
      "Check CoreDNS metrics and drop rates: `kubectl top pods -n kube-system -l k8s-app=kube-dns`.",
    ],
    remediation: "1. In application code, use fully qualified domain names with a trailing dot: `api.stripe.com.`.\n2. Configure custom `dnsConfig` in Pod spec: `options: [{ name: 'ndots', value: '2' }]`.\n3. Deploy `NodeLocal DNSCache` to cache DNS queries locally on each worker node over loopback.",
  },
  {
    id: "tb-3",
    title: "AWS VPC Peering Established but Inter-VPC Traffic Drops",
    tag: "Cloud VPC / Routing",
    symptom: "VPC Peering connection status shows 'Active', but ping and curl between instances in different VPCs time out completely.",
    rootCause: "VPC Peering requires three independent configurations: Peering Connection, Subnet Route Tables, and Security Groups / NACLs. One of these layers is missing return routes.",
    diagnosisSteps: [
      "Check Route Tables in both VPCs: Route for peer CIDR (e.g. `10.2.0.0/16`) pointing to `pcx-xxxx` must exist in both requester AND accepter route tables.",
      "Check Security Groups on target instance: Inbound rules must explicitly allow source CIDR or peer security group ID.",
      "Verify Subnet Network ACLs: Remember NACLs are stateless! Inbound AND ephemeral outbound return ports (1024-65535) must be allowed.",
      "Test MTU: Jumbo frames (9001 MTU) are not supported across inter-region VPC peering (max 1500).",
    ],
    remediation: "Add reciprocal routes in both subnet route tables pointing to the peering connection ID `pcx-xxxx`, and add inbound Security Group rule for the peer subnet CIDR.",
  },
  {
    id: "tb-4",
    title: "TIME_WAIT Socket Accumulation & Ephemeral Port Exhaustion",
    tag: "Kernel / TCP Sockets",
    symptom: "Linux server running API or proxy starts failing new outgoing connections with `Cannot assign requested address` (EADDRNOTAVAIL).",
    rootCause: "Client or proxy is opening and closing rapid non-persistent HTTP/TCP connections without HTTP Keep-Alive. Sockets enter TIME_WAIT state for 60 seconds (2MSL), consuming all ephemeral ports.",
    diagnosisSteps: [
      "Check socket counts by state: `ss -s` or `ss -tan | awk '{print $1}' | sort | uniq -c`.",
      "If TIME-WAIT count exceeds 25,000, ephemeral port range is saturated.",
      "Check current ephemeral port range: `cat /proc/sys/net/ipv4/ip_local_port_range` (typically 32768 - 60999).",
    ],
    remediation: "1. Enable HTTP Connection Pooling / Keep-Alive in application client (reuse HTTP connections instead of re-handshaking per request).\n2. Enable socket reuse in kernel: `sysctl -w net.ipv4.tcp_tw_reuse=1`.\n3. Expand ephemeral port range: `sysctl -w net.ipv4.ip_local_port_range='10240 65535'`.",
  },
];

export default function NetworkingPage() {
  // ─── Calculator State ───
  const [ipInput, setIpInput] = useState("10.0.0.0");
  const [prefixInput, setPrefixInput] = useState(16);

  // ─── OSI Layer State ───
  const [selectedLayerId, setSelectedLayerId] = useState("l7");

  // ─── CLI Command Studio State ───
  const [cmdSearch, setCmdSearch] = useState("");
  const [cmdCategory, setCmdCategory] = useState("All");
  const [copiedCmdId, setCopiedCmdId] = useState<string | null>(null);

  // ─── CNI Matrix State ───
  const [selectedCniId, setSelectedCniId] = useState("calico");

  // ─── Troubleshooting State ───
  const [openPlaybookId, setOpenPlaybookId] = useState<string | null>("tb-1");

  // ─── DNS Simulator State ───
  const [dnsStep, setDnsStep] = useState(0);

  // ─── CIDR Calculations ───
  const cidrResults = useMemo(() => {
    const octets = parseIpv4(ipInput);
    if (!octets || prefixInput < 0 || prefixInput > 32) {
      return null;
    }

    const ipLong = ipToLong(octets);
    const maskLong = prefixInput === 0 ? 0 : (~0 << (32 - prefixInput)) >>> 0;
    const wildcardLong = (~maskLong) >>> 0;
    const netLong = (ipLong & maskLong) >>> 0;
    const broadcastLong = (netLong | wildcardLong) >>> 0;

    const totalHosts = Math.pow(2, 32 - prefixInput);
    const usableHosts = prefixInput >= 31 ? 0 : Math.max(0, totalHosts - 2);
    const awsUsable = prefixInput >= 30 ? 0 : Math.max(0, totalHosts - 5);

    const firstUsable = prefixInput >= 31 ? "N/A" : longToIp(netLong + 1);
    const lastUsable = prefixInput >= 31 ? "N/A" : longToIp(broadcastLong - 1);

    return {
      networkAddress: longToIp(netLong),
      broadcastAddress: longToIp(broadcastLong),
      netmask: longToIp(maskLong),
      wildcardMask: longToIp(wildcardLong),
      firstUsable,
      lastUsable,
      totalHosts,
      usableHosts,
      awsUsable,
      awsReserved: [
        { ip: longToIp(netLong), role: "Network Address (Base)" },
        { ip: longToIp(netLong + 1), role: "AWS VPC Router Gateway" },
        { ip: longToIp(netLong + 2), role: "Amazon-provided DNS (Route 53 Resolver)" },
        { ip: longToIp(netLong + 3), role: "Reserved by AWS for future use" },
        { ip: longToIp(broadcastLong), role: "Network Broadcast Address" },
      ],
    };
  }, [ipInput, prefixInput]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmdId(id);
    toast.success("Command copied to clipboard!");
    setTimeout(() => setCopiedCmdId(null), 2000);
  };

  const filteredCommands = useMemo(() => {
    return COMMANDS.filter((cmd) => {
      const matchCat = cmdCategory === "All" || cmd.category === cmdCategory;
      const matchQuery =
        !cmdSearch ||
        cmd.title.toLowerCase().includes(cmdSearch.toLowerCase()) ||
        cmd.command.toLowerCase().includes(cmdSearch.toLowerCase()) ||
        cmd.description.toLowerCase().includes(cmdSearch.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [cmdCategory, cmdSearch]);

  const selectedLayer = LAYERS.find((l) => l.id === selectedLayerId) || LAYERS[0];
  const selectedCni = CNI_OPTIONS.find((c) => c.id === selectedCniId) || CNI_OPTIONS[0];

  // DNS Steps
  const DNS_STEPS = [
    {
      title: "1. Client / Pod Local Cache",
      desc: "Client executes curl or opens connection. Checks browser DNS cache, local OS cache (systemd-resolved), and /etc/hosts file.",
      status: "Cache Miss: Query passed to Recursive Resolver configured in /etc/resolv.conf (e.g. 10.0.0.2 / 8.8.8.8).",
      icon: HardDrive,
    },
    {
      title: "2. Recursive DNS Resolver (ISP / Route 53)",
      desc: "Recursive resolver checks its internal cache TTL. If unexpired, returns answer immediately. Otherwise initiates iterative walk.",
      status: "Iterative Lookup initiated to Root Zone ('.').",
      icon: Server,
    },
    {
      title: "3. Root DNS Nameservers ('.')",
      desc: "There are 13 named root authority systems globally (A through M). The root server does not know the final IP, but knows who operates the TLD.",
      status: "Root replies with referral to Top-Level Domain (TLD) nameservers for '.com'.",
      icon: Globe,
    },
    {
      title: "4. TLD Nameservers ('.com', '.org', '.io')",
      desc: "The TLD server (e.g. Verisign for .com) holds the delegation records for domain registrations.",
      status: "TLD replies with referral NS records to Authoritative Nameservers (e.g. ns-1.awsdns.com).",
      icon: Layers,
    },
    {
      title: "5. Authoritative Nameservers",
      desc: "The domain owner's authoritative server (Route 53, Cloudflare, BIND) holds the definitive DNS zone file with A, CNAME, and TXT records.",
      status: "Authoritative server returns A Record: api.stripe.com -> 54.187.159.182 with TTL = 300s.",
      icon: Network,
    },
    {
      title: "6. Client Connection Established",
      desc: "The recursive resolver caches the record for 300 seconds and returns the IP to the client. Client initiates TCP 3-Way Handshake on port 443.",
      status: "SYN -> SYN-ACK -> ACK -> TLS ClientHello handshake complete!",
      icon: Zap,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* ─── HERO HEADER ─── */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Interactive DevOps Networking Architecture & Lab
          </div>

          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight">
            Networking for <br />
            <span className="gradient-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-transparent bg-clip-text">
              DevOps & Cloud Engineers
            </span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Master the invisible backbone of modern infrastructure. Explore packet flows, calculate cloud VPC CIDR subnets, troubleshoot Linux sockets, and conquer Kubernetes CNI overlays.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/courses/networking-for-devops"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
            >
              <BookOpen className="w-4 h-4" /> Start Complete Course
            </Link>
            <Link
              to="/quiz/networking-for-devops"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card font-semibold text-sm hover:bg-muted transition-all"
            >
              <Award className="w-4 h-4 text-cyan-400" /> Take Assessment Quiz
            </Link>
            <a
              href="#cidr-calculator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground font-semibold text-sm hover:bg-muted/50 transition-all"
            >
              <Cpu className="w-4 h-4 text-primary" /> Jump to Tools
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/60">
            <div>
              <div className="text-2xl font-bold font-mono text-cyan-400">7 Layers</div>
              <div className="text-xs text-muted-foreground">OSI & TCP/IP Model</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-blue-400">Live CIDR</div>
              <div className="text-xs text-muted-foreground">Cloud VPC Calculator</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-indigo-400">4 Top CNIs</div>
              <div className="text-xs text-muted-foreground">Calico, Cilium, Flannel</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-violet-400">100% Free</div>
              <div className="text-xs text-muted-foreground">Hands-on Labs Included</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 1: INTERACTIVE CIDR & SUBNET CALCULATOR ─── */}
      <section id="cidr-calculator" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Radio className="w-3.5 h-3.5" /> Interactive Engineering Tool
            </div>
            <h2 className="text-3xl font-display font-bold">
              Cloud Subnet & <span className="gradient-text">CIDR Calculator</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Calculate IP ranges, broadcast boundaries, and AWS VPC reserved addresses in real-time.
            </p>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Presets:</span>
            {[
              { label: "AWS VPC (/16)", ip: "10.0.0.0", prefix: 16 },
              { label: "Public Subnet (/24)", ip: "10.0.1.0", prefix: 24 },
              { label: "EKS Pod CIDR (/20)", ip: "172.16.0.0", prefix: 20 },
              { label: "Bastion/DB (/28)", ip: "192.168.1.0", prefix: 28 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setIpInput(preset.ip);
                  setPrefixInput(preset.prefix);
                }}
                className="px-2.5 py-1 text-xs font-mono rounded-lg border border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 p-6 rounded-2xl border border-border bg-card space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                IPv4 Network Address
              </label>
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="e.g. 10.0.0.0"
                className="w-full px-4 py-2.5 text-sm font-mono bg-muted/60 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Subnet Mask Prefix (/{prefixInput})
                </label>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  {cidrResults?.netmask || "Invalid"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                value={prefixInput}
                onChange={(e) => setPrefixInput(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-mono text-muted-foreground mt-1">
                <span>/0 (Internet)</span>
                <span>/16 (VPC)</span>
                <span>/24 (Subnet)</span>
                <span>/32 (Host)</span>
              </div>
            </div>

            {/* Visual bit map representation */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
              <div className="text-xs font-semibold text-muted-foreground flex justify-between">
                <span>Network vs Host Bit Split:</span>
                <span className="font-mono text-foreground">{prefixInput} net / {32 - prefixInput} host</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden border border-border/80">
                <div
                  style={{ width: `${(prefixInput / 32) * 100}%` }}
                  className="bg-cyan-500 transition-all duration-300"
                  title="Network Bits"
                />
                <div
                  style={{ width: `${((32 - prefixInput) / 32) * 100}%` }}
                  className="bg-indigo-500 transition-all duration-300"
                  title="Host Bits"
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span className="text-cyan-400">Network ID ({prefixInput} bits)</span>
                <span className="text-indigo-400">Host Capacity ({32 - prefixInput} bits)</span>
              </div>
            </div>

            {/* AWS Callout */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
              <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Cloud VPC Rule (AWS / GCP / Azure)
              </div>
              <p className="text-muted-foreground text-[12px] leading-relaxed">
                AWS always reserves exactly <strong className="text-foreground">5 IP addresses</strong> in every subnet: .0 (network), .1 (VPC router), .2 (DNS resolver), .3 (future use), and .255 (broadcast).
              </p>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 p-6 rounded-2xl border border-border bg-card space-y-6">
            {cidrResults ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                    <div className="text-xs text-muted-foreground font-medium mb-1">Network Base</div>
                    <div className="text-sm font-bold font-mono text-cyan-400">{cidrResults.networkAddress}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                    <div className="text-xs text-muted-foreground font-medium mb-1">Broadcast Address</div>
                    <div className="text-sm font-bold font-mono text-indigo-400">{cidrResults.broadcastAddress}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                    <div className="text-xs text-muted-foreground font-medium mb-1">Subnet Mask</div>
                    <div className="text-sm font-bold font-mono">{cidrResults.netmask}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                    <div className="text-xs text-muted-foreground font-medium mb-1">Total IP Addresses</div>
                    <div className="text-sm font-bold font-mono">{cidrResults.totalHosts.toLocaleString()}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                    <div className="text-xs text-muted-foreground font-medium mb-1">Standard Usable</div>
                    <div className="text-sm font-bold font-mono text-green-400">
                      {cidrResults.usableHosts.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border bg-amber-500/5">
                    <div className="text-xs text-amber-400 font-medium mb-1">AWS Usable</div>
                    <div className="text-sm font-bold font-mono text-amber-300">
                      {cidrResults.awsUsable.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Usable Host Range */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Usable Host Range (Standard IPv4)</div>
                    <div className="text-sm font-mono font-bold mt-0.5">
                      {cidrResults.firstUsable} — {cidrResults.lastUsable}
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-mono text-primary self-start sm:self-auto">
                    /{prefixInput} CIDR Block
                  </div>
                </div>

                {/* AWS Reserved Breakdown List */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                    AWS VPC 5-IP Reserved Address Breakdown:
                  </h4>
                  <div className="space-y-1.5 font-mono text-xs">
                    {cidrResults.awsReserved.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border border-border/60"
                      >
                        <span className="font-bold text-foreground">{item.ip}</span>
                        <span className="text-muted-foreground text-[11px]">{item.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground">
                <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
                <p className="font-semibold">Invalid IPv4 Address Format</p>
                <p className="text-xs">Please enter a valid format such as 10.0.0.0 or 192.168.1.0</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: INTERACTIVE OSI & TCP/IP EXPLORER ─── */}
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" /> Protocol Stack Architecture
          </div>
          <h2 className="text-3xl font-display font-bold">
            OSI & TCP/IP Model for <span className="gradient-text">DevOps Engineers</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Understand where failures occur in production microservices and how each layer impacts cloud infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Layer Selector Tabs */}
          <div className="lg:col-span-4 space-y-2">
            {LAYERS.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md shadow-primary/5"
                      : "border-border bg-card hover:bg-muted/50 text-muted-foreground"
                  )}
                >
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-medium text-primary">{layer.osiLayer}</div>
                    <div className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {layer.name}
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-5 h-5 transition-transform",
                      isSelected ? "text-primary translate-x-1" : "text-muted-foreground group-hover:translate-x-0.5"
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Active Layer Details Card */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold">{selectedLayer.osiLayer} • {selectedLayer.tcpLayer}</span>
                <h3 className="text-2xl font-display font-bold mt-1">{selectedLayer.name}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedLayer.protocols.map((proto) => (
                  <span
                    key={proto}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg bg-muted border border-border text-foreground"
                  >
                    {proto}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                DevOps & Infrastructure Role
              </h4>
              <p className="text-sm text-foreground/90 leading-relaxed">{selectedLayer.devopsRole}</p>
            </div>

            {/* Production Failure Modes */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5 text-red-400">
                <AlertCircle className="w-3.5 h-3.5" /> Common Production Failure Modes:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedLayer.failureModes.map((fm, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-foreground/90 leading-normal"
                  >
                    {fm}
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Command */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Key Diagnostic Command:</span>
                <button
                  onClick={() => copyToClipboard(selectedLayer.sampleCommand, `layer-${selectedLayer.id}`)}
                  className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline"
                >
                  {copiedCmdId === `layer-${selectedLayer.id}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Command
                    </>
                  )}
                </button>
              </div>
              <pre className="font-mono text-xs text-cyan-300 bg-background/90 p-3 rounded-lg border border-border/80 overflow-x-auto">
                $ {selectedLayer.sampleCommand}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: VISUAL DNS RESOLUTION SIMULATOR ─── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Globe className="w-3.5 h-3.5" /> Resolution Flow
            </div>
            <h2 className="text-3xl font-display font-bold">
              Visual DNS Resolution <span className="gradient-text">Simulator</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              "It's always DNS." Walk step-by-step through an iterative query for <span className="font-mono text-primary">api.stripe.com</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDnsStep((prev) => (prev > 0 ? prev - 1 : 0))}
              disabled={dnsStep === 0}
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous Step
            </button>
            <button
              onClick={() => setDnsStep((prev) => (prev < DNS_STEPS.length - 1 ? prev + 1 : 0))}
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              {dnsStep === DNS_STEPS.length - 1 ? "Restart Simulation" : "Next Step →"}
            </button>
          </div>
        </div>

        {/* Step Indicator Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DNS_STEPS.map((step, idx) => {
            const isActive = idx === dnsStep;
            const isCompleted = idx < dnsStep;
            const Icon = step.icon;
            return (
              <button
                key={idx}
                onClick={() => setDnsStep(idx)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all relative overflow-hidden",
                  isActive
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                    : isCompleted
                    ? "border-green-500/30 bg-green-500/5 text-muted-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={cn("w-4 h-4", isActive ? "text-primary" : isCompleted ? "text-green-400" : "text-muted-foreground")} />
                  <span className="text-[10px] font-mono">Step {idx + 1}</span>
                </div>
                <div className="text-xs font-semibold line-clamp-1 text-foreground">{step.title.split(". ")[1]}</div>
              </button>
            );
          })}
        </div>

        {/* Active DNS Step Card */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
              {dnsStep + 1}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">{DNS_STEPS[dnsStep].title}</h3>
              <p className="text-xs text-muted-foreground font-mono">Query Target: api.stripe.com (Type: A)</p>
            </div>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed">{DNS_STEPS[dnsStep].desc}</p>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-start gap-3">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs font-mono text-cyan-300">{DNS_STEPS[dnsStep].status}</div>
          </div>
        </div>

        {/* DNS Record Types Quick Reference */}
        <div className="p-6 rounded-2xl border border-border bg-card/60 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            DevOps DNS Record Cheat Sheet
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-muted/30 border border-border/80">
              <span className="font-bold text-cyan-400 font-mono">A Record</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">Maps domain to IPv4 address (e.g. 1.2.3.4)</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30 border border-border/80">
              <span className="font-bold text-cyan-400 font-mono">AAAA Record</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">Maps domain to 128-bit IPv6 address</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30 border border-border/80">
              <span className="font-bold text-cyan-400 font-mono">CNAME</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">Canonical alias to another domain name</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30 border border-border/80">
              <span className="font-bold text-cyan-400 font-mono">SRV Record</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">Host + Port used by K8s headless services</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: LINUX NETWORKING COMMAND STUDIO ─── */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Terminal className="w-3.5 h-3.5" /> Terminal Lab
            </div>
            <h2 className="text-3xl font-display font-bold">
              DevOps Linux <span className="gradient-text">Command Studio</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Battle-tested terminal recipes for socket inspection, packet capture, latency tracing, and NAT rules.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={cmdSearch}
              onChange={(e) => setCmdSearch(e.target.value)}
              placeholder="Search ss, curl, tcpdump..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {["All", "Sockets & Ports", "DNS & Connectivity", "Packet Capture", "Routing & NAT", "Firewall"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCmdCategory(cat)}
                className={cn(
                  "px-3 py-1 text-xs rounded-lg border transition-colors",
                  cmdCategory === cat
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border hover:border-muted-foreground/40 text-muted-foreground"
                )}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Command Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCommands.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-border bg-card space-y-3.5 hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {item.category}
                  </span>
                  <button
                    onClick={() => copyToClipboard(item.command, item.id)}
                    className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline"
                  >
                    {copiedCmdId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>

                <h4 className="font-display font-bold text-base">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>

              <div className="space-y-2 pt-2">
                {/* Command Bar */}
                <div className="p-2.5 rounded-lg bg-[hsl(220_18%_5%)] border border-border/80 font-mono text-xs text-cyan-300 flex items-center justify-between overflow-x-auto">
                  <span>$ {item.command}</span>
                </div>

                {/* Flags explanation */}
                <div className="text-[11px] font-mono text-muted-foreground px-1">
                  <strong className="text-foreground">Flags:</strong> {item.flagsBreakdown}
                </div>

                {/* Sample Output Terminal Snippet */}
                <details className="text-[11px] group">
                  <summary className="cursor-pointer text-xs text-primary font-medium hover:underline select-none">
                    View Real-World Sample Terminal Output
                  </summary>
                  <pre className="mt-2 p-3 rounded-lg bg-[hsl(220_18%_4%)] border border-border font-mono text-[10px] text-green-400 overflow-x-auto leading-snug">
                    {item.sampleOutput}
                  </pre>
                </details>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 5: KUBERNETES CNI ARCHITECTURE MATRIX ─── */}
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5" /> Kubernetes Internals
          </div>
          <h2 className="text-3xl font-display font-bold">
            Kubernetes CNI & <span className="gradient-text">Container Networking</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Compare modern CNI (Container Network Interface) plugins powering production clusters.
          </p>
        </div>

        {/* CNI Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CNI_OPTIONS.map((cni) => (
            <button
              key={cni.id}
              onClick={() => setSelectedCniId(cni.id)}
              className={cn(
                "p-4 rounded-xl border text-left transition-all",
                selectedCniId === cni.id
                  ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                  : "border-border bg-card hover:bg-muted text-muted-foreground"
              )}
            >
              <span className="text-[10px] font-mono text-primary font-semibold block mb-1">{cni.badge}</span>
              <div className="font-display font-bold text-foreground text-sm">{cni.name}</div>
            </button>
          ))}
        </div>

        {/* Active CNI Deep Dive */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <div className="text-xs font-mono text-cyan-400">{selectedCni.badge}</div>
              <h3 className="text-2xl font-display font-bold">{selectedCni.name}</h3>
            </div>
            <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              Best For: {selectedCni.bestFor}
            </div>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed">{selectedCni.description}</p>

          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Data Plane & Packet Routing Architecture:</div>
            <div className="text-xs font-mono text-cyan-300">{selectedCni.architecture}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-green-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Key Advantages
              </h4>
              <ul className="space-y-1.5 text-xs text-foreground/85">
                {selectedCni.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-green-400 shrink-0">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Tradeoffs & Considerations
              </h4>
              <ul className="space-y-1.5 text-xs text-foreground/85">
                {selectedCni.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 shrink-0">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: PRODUCTION TROUBLESHOOTING PLAYBOOKS ─── */}
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5" /> Real-World Scenarios
          </div>
          <h2 className="text-3xl font-display font-bold">
            Production Network <span className="gradient-text">Troubleshooting Playbooks</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Step-by-step diagnostic workflows for the most frequent network outages in modern DevOps environments.
          </p>
        </div>

        <div className="space-y-3">
          {TROUBLESHOOTING_PLAYBOOKS.map((pb) => {
            const isOpen = openPlaybookId === pb.id;
            return (
              <div
                key={pb.id}
                className="rounded-2xl border border-border bg-card overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenPlaybookId(isOpen ? null : pb.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/40 transition-colors"
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {pb.tag}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">Incident Runbook</span>
                    </div>
                    <div className="font-display font-bold text-base text-foreground">{pb.title}</div>
                  </div>
                  <ChevronDown
                    className={cn("w-5 h-5 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 pt-2 border-t border-border/60 space-y-4"
                    >
                      <div className="p-3.5 rounded-xl bg-muted/40 text-xs space-y-1">
                        <span className="font-semibold text-foreground">Symptom:</span>
                        <p className="text-muted-foreground">{pb.symptom}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 text-xs space-y-1">
                        <span className="font-semibold text-red-400">Root Cause:</span>
                        <p className="text-foreground/90">{pb.rootCause}</p>
                      </div>

                      <div>
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Step-by-Step Diagnostic Commands:
                        </h5>
                        <ul className="space-y-1.5 text-xs">
                          {pb.diagnosisSteps.map((step, idx) => (
                            <li key={idx} className="p-2.5 rounded-lg bg-[hsl(220_18%_5%)] border border-border/80 font-mono text-cyan-300">
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-green-500/5 border border-green-500/20 text-xs space-y-1">
                        <span className="font-semibold text-green-400">Permanent Remediation:</span>
                        <pre className="font-mono text-foreground/90 whitespace-pre-wrap font-sans text-xs">
                          {pb.remediation}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── SECTION 7: COURSE & ASSESSMENT CTA ─── */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-cyan-950/40 via-background to-blue-950/40 p-8 sm:p-12 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <Award className="w-3.5 h-3.5" /> Verified Certification Course
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold">
            Ready to Master <span className="gradient-text">Networking for DevOps?</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Enroll in our 10-hour comprehensive course covering OSI & TCP/IP, Linux socket troubleshooting, DNS, Kubernetes CNI, and AWS VPC infrastructure.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/courses/networking-for-devops"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/25"
            >
              Enroll in Full Course Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/quiz/networking-for-devops"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border bg-card font-semibold text-sm hover:bg-muted transition-all"
            >
              Take Assessment Quiz
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
